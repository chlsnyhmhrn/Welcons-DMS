import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

export default function DetailMonitoring() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const { namaProyek } = useParams();

  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");

  const [filterKategori, setFilterKategori] =
    useState("Semua");

  const [adminProyek, setAdminProyek] =
  useState("");

  const [pengawasProyek, setPengawasProyek] =
    useState([]);

  const [openTim, setOpenTim] =
  useState(false);

  const [usersList, setUsersList] =
    useState([]);

  const [selectedAdmin, setSelectedAdmin] =
    useState("");

  const [selectedPengawas, setSelectedPengawas] =
    useState([]);

  // ================= FETCH =================
  const fetchDokumen = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/dokumen"
      );

      const data = await res.json();

      setDocuments(data);

    } catch (err) {

      console.log(err);
    }
  };

  // ================= CEK AKSES PENGAWAS =================
  const cekAkses = async () => {

    try {

      // ADMIN DAN DIREKTUR BEBAS
      if (
        user.role === "admin" ||
        user.role === "direktur"
      ) {
        return;
      }

      const res = await fetch(
        "http://localhost:5000/proyek"
      );

      const proyekList =
        await res.json();

      const proyek =
        proyekList.find(
          (p) =>
            p.nama_proyek ===
            decodeURIComponent(
              namaProyek
            )
        );

      if (!proyek) return;

      const resAssign =
        await fetch(
          `http://localhost:5000/proyek/${proyek.id_proyek}/users`
        );

      const data =
        await resAssign.json();

      const assigned =
        data.assigned.some(
          (item) =>
            item.id_user ===
            user.id_user
        );

      if (!assigned) {

        alert(
          "Anda tidak memiliki akses ke proyek ini"
        );

        navigate(
          "/monitoring"
        );
      }

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchDokumen();

    cekAkses();

    fetchAssignment();

  }, []);

    // ================= FETCH ASSIGNMENT =================
  const fetchAssignment = async () => {

    try {

      const resProyek =
        await fetch(
          "http://localhost:5000/proyek"
        );

      const proyekList =
        await resProyek.json();

      const proyek =
        proyekList.find(
          (p) =>
            p.nama_proyek ===
            decodeURIComponent(
              namaProyek
            )
        );

      if (!proyek) return;

      const res =
        await fetch(
          `http://localhost:5000/proyek/${proyek.id_proyek}/users`
        );

      const data =
        await res.json();

      const admin =
        data.assigned.find(
          (a) =>
            a.role_penugasan ===
            "admin"
        );

      const pengawas =
        data.assigned.filter(
          (a) =>
            a.role_penugasan ===
            "pengawas"
        );

      const adminUser =
        data.users.find(
          (u) =>
            u.id_user ===
            admin?.id_user
        );

      const pengawasUser =
        data.users.filter(
          (u) =>
            pengawas.some(
              (p) =>
                p.id_user ===
                u.id_user
            )
        );

      setAdminProyek(
        adminUser
          ?.nama_lengkap ||
          "-"
      );

      setPengawasProyek(
        pengawasUser
      );

      setUsersList(
        data.users
      );

      setSelectedAdmin(
        admin?.id_user || ""
      );

      setSelectedPengawas(
        pengawas.map(
          (p) => p.id_user
        )
      );

    } catch (err) {

      console.log(err);
    }
  };

  const saveAssignment =
  async () => {

    try {

      const resProyek =
        await fetch(
          "http://localhost:5000/proyek"
        );

      const proyekList =
        await resProyek.json();

      const proyek =
        proyekList.find(
          (p) =>
            p.nama_proyek ===
            decodeURIComponent(
              namaProyek
            )
        );

      if (!proyek) return;

      await fetch(
        `http://localhost:5000/proyek/${proyek.id_proyek}/users`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            admin:
              selectedAdmin,

            pengawas:
              selectedPengawas
          })
        }
      );

      await fetchAssignment();

      setOpenTim(false);

      alert(
        "Tim proyek berhasil diperbarui"
      );

    } catch (err) {

      console.log(err);

      alert(
        "Gagal menyimpan tim proyek"
      );
    }
  };

  // ================= FILTER PROYEK =================
  const filteredDocs = useMemo(() => {

    return documents.filter(
      (doc) =>
        doc.nama_proyek ===
        decodeURIComponent(namaProyek)
    );

  }, [documents, namaProyek]);

  // ================= LIST KATEGORI =================
  const kategoriList = [
    "Semua",
    ...new Set(
      filteredDocs.map(
        (doc) => doc.nama_kategori
      )
    )
  ];

  // ================= GROUP PEKERJAAN =================
  const pekerjaanList = useMemo(() => {

    const grouped = {};

    filteredDocs.forEach((doc) => {

      const key = doc.nama_dokumen;

      if (!grouped[key]) {

        grouped[key] = {
          nama_dokumen:
            doc.nama_dokumen,
          total_submit: 0,
          status: doc.status,
          versi: doc.versi,
          latest_id: doc.id_dokumen,
          kategori:
            doc.nama_kategori,
          created_at:
            doc.created_at
        };
      }

      grouped[key].total_submit += 1;

      if (
        doc.versi >
        grouped[key].versi
      ) {

        grouped[key].versi =
          doc.versi;

        grouped[key].status =
          doc.status;

        grouped[key].latest_id =
          doc.id_dokumen;

        grouped[key].created_at =
          doc.created_at;
      }
    });

    return Object.values(grouped).filter(
      (item) => {

        const matchSearch =
          item.nama_dokumen
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchKategori =
          filterKategori ===
            "Semua" ||
          item.kategori ===
            filterKategori;

        return (
          matchSearch &&
          matchKategori
        );
      }
    );

  }, [
    filteredDocs,
    search,
    filterKategori
  ]);

  // ================= STATUS COLOR =================
  const getStatusColor = (
    status
  ) => {

    switch (status) {

      case "Final":
        return "success";

      case "Perlu Revisi":
        return "warning";

      case "Obsolete":
        return "error";

      default:
        return "default";
    }
  };

// ================= UI =================
return (
  <MainLayout title="Detail Monitoring">

    {/* WRAPPER FULL HEIGHT */}
      <Box
        sx={{
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >

      {/* ================= HEADER ================= */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexShrink={0}
      >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
          >

            <IconButton
              onClick={() =>
                navigate(-1)
              }
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              {decodeURIComponent(
                namaProyek
              )}
            </Typography>

          </Box>

      </Box>

      {/* ================= SUMMARY + TIM PROYEK (1 BARIS) ================= */}
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 2,
          mb: 2,
          flexShrink: 0
        }}
      >

        {/* SUMMARY CARDS (KIRI) */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flex: 3
          }}
        >

          {/* TOTAL PEKERJAAN */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              flex: 1
            }}
          >

            <CardContent
              sx={{
                width: "100%",
                py: 2
              }}
            >

              <Box
                display="flex"
                alignItems="center"
                gap={2}
              >

                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "#E3F2FD",
                    color: "#1565C0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <AssignmentOutlinedIcon />
                </Box>

                <Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Pekerjaan
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                  >
                    {pekerjaanList.length}
                  </Typography>

                </Box>

              </Box>

            </CardContent>

          </Card>

          {/* TOTAL SUBMIT */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              flex: 1
            }}
          >

          <CardContent
            sx={{
              width: "100%",
              py: 2
            }}
          >

            <Box
              display="flex"
              alignItems="center"
              gap={2}
            >

              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: "#F3E5F5",
                  color: "#6A1B9A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <UploadFileOutlinedIcon />
              </Box>

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Submit
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {filteredDocs.length}
                </Typography>

              </Box>

            </Box>

          </CardContent>

          </Card>

          {/* FINAL */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              flex: 1
            }}
          >

           <CardContent
            sx={{
              width: "100%",
              py: 2
            }}
          >

            <Box
              display="flex"
              alignItems="center"
              gap={2}
            >

              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: "#E8F5E9",
                  color: "#2E7D32",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <CheckCircleOutlineIcon />
              </Box>

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Dokumen Final
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {
                    pekerjaanList.filter(
                      (d) =>
                        d.status === "Final"
                    ).length
                  }
                </Typography>

              </Box>

            </Box>

          </CardContent>

          </Card>

        </Box>

{/* TIM PROYEK (KANAN) */}
<Card
  sx={{
    borderRadius: 4,
    boxShadow: 2,
    flex: 1
  }}
>

  <CardContent
    sx={{
      width: "100%",
      py: 2
    }}
  >

    <Box
      display="flex"
      gap={2}
    >

      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          bgcolor: "#FFF3E0",
          color: "#ED6C02",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        <GroupOutlinedIcon />
      </Box>

      <Box sx={{ flex: 1 }}>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Tim Proyek
        </Typography>

        <Typography
          fontWeight="bold"
        >
          Admin: {adminProyek || "-"}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mb: 1
          }}
        >
          Pengawas: {
            pengawasProyek.length > 0
              ? pengawasProyek
                  .map(
                    (p) =>
                      p.nama_lengkap
                  )
                  .join(", ")
              : "-"
          }
        </Typography>

        {user?.role === "direktur" && (

          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              setOpenTim(true)
            }
            sx={{
              mt: 1,
              textTransform: "none"
            }}
          >
            Kelola Tim
          </Button>

        )}

      </Box>

    </Box>

  </CardContent>

</Card>

      </Box>

      {/* ================= SEARCH ================= */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 2,
          mb: 3,
          flexShrink: 0
        }}
      >

        <CardContent
          sx={{
            py: 2,
            px: 2.5
          }}
        >

          <Grid
            container
            spacing={2}
            alignItems="center"
          >

            {/* SEARCH */}
            <Grid item xs={12} md={5}>

              <TextField
                fullWidth
                size="small"
                placeholder="Cari nama dokumen..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  )
                }}
              />

            </Grid>

            {/* FILTER */}
            <Grid item xs={12} md={3}>

              <TextField
                select
                fullWidth
                size="small"
                label="Kategori"
                value={filterKategori}
                onChange={(e) =>
                  setFilterKategori(
                    e.target.value
                  )
                }
              >

                {kategoriList.map(
                  (
                    kategori,
                    index
                  ) => (

                    <MenuItem
                      key={index}
                      value={kategori}
                    >
                      {kategori}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>

          </Grid>

        </CardContent>

      </Card>

      {/* ================= SCROLL AREA ================= */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pr: 1
        }}
      >

        <Grid container spacing={3}>

          {pekerjaanList.map(
            (item, index) => (

              <Grid
                item
                xs={12}
                md={6}
                key={index}
              >

                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 2,
                    transition: "0.2s",
                    "&:hover": {
                      transform:
                        "translateY(-4px)",
                      boxShadow: 5
                    }
                  }}
                >

                  <CardContent>

                    {/* NAMA */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={1}
                    >
                      {item.nama_dokumen}
                    </Typography>

                    {/* KATEGORI */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={2}
                    >
                      {item.kategori}
                    </Typography>

                    {/* STATUS */}
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      mb={2}
                    >

                      <Chip
                        label={`v${item.versi}`}
                        variant="outlined"
                        size="small"
                      />

                      <Chip
                        label={`${item.total_submit}x Submit`}
                        color="primary"
                        size="small"
                      />

                      <Chip
                        label={item.status}
                        color={getStatusColor(
                          item.status
                        )}
                        size="small"
                      />

                    </Stack>

                    {/* UPDATE */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={3}
                    >
                      Update terakhir:
                      {" "}
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </Typography>

                    {/* BUTTON */}
                    <Button
                      variant="contained"
                      startIcon={
                        <VisibilityOutlinedIcon />
                      }
                      onClick={() =>
                        navigate(
                          `/detail-dokumen/${item.latest_id}`
                        )
                      }
                      sx={{
                        borderRadius: 3,
                        textTransform:
                          "none",
                        fontWeight:
                          "bold"
                      }}
                    >
                      Lihat Riwayat
                    </Button>

                  </CardContent>

                </Card>

              </Grid>

            )
          )}

        </Grid>

      </Box>

    </Box>

        <Dialog
      open={openTim}
      onClose={() =>
        setOpenTim(false)
      }
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>
        Kelola Tim Proyek
      </DialogTitle>

      <DialogContent>

        <TextField
          select
          fullWidth
          label="Admin Proyek"
          value={selectedAdmin}
          onChange={(e) =>
            setSelectedAdmin(
              e.target.value
            )
          }
          sx={{ mt: 1, mb: 3 }}
        >

          {usersList
            .filter(
              (u) =>
                u.role === "admin"
            )
            .map((user) => (

              <MenuItem
                key={user.id_user}
                value={user.id_user}
              >
                {user.nama_lengkap}
              </MenuItem>

            ))}

        </TextField>

        <Typography
          fontWeight="bold"
          mb={1}
        >
          Pengawas
        </Typography>

        {usersList
          .filter(
            (u) =>
              u.role === "pengawas"
          )
          .map((user) => (

            <FormControlLabel
              key={user.id_user}
              control={
                <Checkbox
                  checked={
                    selectedPengawas.includes(
                      user.id_user
                    )
                  }
                  onChange={(e) => {

                    if (
                      e.target.checked
                    ) {

                      setSelectedPengawas([
                        ...selectedPengawas,
                        user.id_user
                      ]);

                    } else {

                      setSelectedPengawas(
                        selectedPengawas.filter(
                          (id) =>
                            id !==
                            user.id_user
                        )
                      );
                    }
                  }}
                />
              }
              label={
                user.nama_lengkap
              }
            />

          ))}

      </DialogContent>

      <DialogActions>

        <Button
          onClick={() =>
            setOpenTim(false)
          }
        >
          Batal
        </Button>

        <Button
          variant="contained"
          onClick={saveAssignment}
        >
          Simpan
        </Button>

      </DialogActions>

    </Dialog>

  </MainLayout>
);
}