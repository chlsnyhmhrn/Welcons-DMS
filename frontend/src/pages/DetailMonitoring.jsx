import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

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
  IconButton
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function DetailMonitoring() {

  const navigate = useNavigate();

  const { namaProyek } = useParams();

  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");

  const [filterKategori, setFilterKategori] =
    useState("Semua");

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

  useEffect(() => {

    fetchDokumen();

  }, []);

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

      // 🔥 AMBIL VERSI TERBARU
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
        alignItems="center"
        gap={1}
        mb={2}
        flexShrink={0}
      >

        <IconButton
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box>

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

      {/* ================= SUMMARY ================= */}
      <Grid
        container
        spacing={2}
        sx={{
          mb: 2,
          flexShrink: 0
        }}
      >

        {/* TOTAL PEKERJAAN */}
        <Grid item xs={12} sm={6} md={2}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2
            }}
          >

            <CardContent
              sx={{
                py: 1,
                px: 2.5
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Pekerjaan
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mt: 0.5 }}
              >
                {pekerjaanList.length}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        {/* TOTAL SUBMIT */}
        <Grid item xs={12} sm={6} md={2}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2
            }}
          >

            <CardContent
              sx={{
                py: 1,
                px: 2.5
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Submit
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mt: 0.5 }}
              >
                {filteredDocs.length}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        {/* FINAL */}
        <Grid item xs={12} sm={6} md={2}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2
            }}
          >

            <CardContent
              sx={{
                py: 1,
                px: 2.5
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Dokumen Final
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mt: 0.5 }}
              >
                {
                  pekerjaanList.filter(
                    (d) =>
                      d.status ===
                      "Final"
                  ).length
                }
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

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

  </MainLayout>
);
}