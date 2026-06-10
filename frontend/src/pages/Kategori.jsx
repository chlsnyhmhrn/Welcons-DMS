import { useEffect, useState } from "react";

import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  Card,
  Divider,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useAuth } from "../context/AuthContext";

import axios from "axios";

export default function Kategori() {

  const { user } = useAuth();

  const [kategori, setKategori] = useState([]);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nama_kategori: "",

    jenis_proyek: "",
    bidang: "",
    jenis_form: "",
    item_pekerjaan: "",

    is_tipikal: 0,

    is_active: 1
  });

  const [editId, setEditId] = useState(null);

    const jenisProyekList = [
    "Gedung",
    "Rumah",
    "Pondasi Bawah"
  ];

  const bidangList = [
    "Struktur",
    "Arsitektur",
    "Plumbing",
    "Fire Fighting",
    "AC",
    "Elektrikal",
    "Elektronik"
  ];

  const jenisFormList = [
    "IPL",
    "Form Inspeksi",
    "Form Test",
    "Piling Record"
  ];

  // ================= FETCH DATA =================
  const fetchData = async () => {

    const res = await axios.get(
      "http://localhost:5000/kategori"
    );

    setKategori(res.data);
  };

  useEffect(() => {

    fetchData();

  }, []);

  // ================= ROLE CHECK =================
  if (user.role !== "admin") {

    return (
      <MainLayout title="Kategori Dokumen">

        <Typography>
          Anda tidak memiliki akses.
        </Typography>

      </MainLayout>
    );
  }

  // ================= OPEN MODAL =================
  const handleOpen = () => {

    setForm({
      nama_kategori: "",

      jenis_proyek: "",
      bidang: "",
      jenis_form: "",
      item_pekerjaan: "",

      is_tipikal: 0,

      is_active: 1
    });

    setEditId(null);

    setOpen(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    // ================= VALIDASI FIELD =================
    if (
      !form.nama_kategori ||
      !form.jenis_proyek ||
      !form.bidang ||
      !form.jenis_form ||
      !form.item_pekerjaan
    ){
      alert(
        "Nama kategori wajib diisi"
      );

      return;
    }

    try {

      // ================= CEK DUPLIKAT =================
      const duplicate =
        kategori.some(
          (item) =>

            item.nama_kategori
              .toLowerCase()
              .trim() ===
              form.nama_kategori
                .toLowerCase()
                .trim() &&

            // 🔥 KECUALI DATA SENDIRI
            item.id_kategori !== editId
        );

      if (duplicate) {

        alert(
          "Kategori sudah tersedia"
        );

        return;
      }

      // ================= EDIT =================
      if (editId) {

      await axios.put(
        `http://localhost:5000/kategori/${editId}`,
        form,
        {
          headers: {
            id_user: user.id_user,
            role: user.role
          }
        }
      );

      } else {

        // ================= TAMBAH =================
        await axios.post(
          "http://localhost:5000/kategori",
          form,
          {
            headers: {
              id_user: user?.id_user,
              role: user?.role
            }
          }
        );
      }

      setOpen(false);

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        "Gagal menyimpan kategori"
      );
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {

    setForm({
      nama_kategori:
        item.nama_kategori,

      jenis_proyek:
        item.jenis_proyek,

      bidang:
        item.bidang,

      jenis_form:
        item.jenis_form,

      item_pekerjaan:
        item.item_pekerjaan,

      is_tipikal:
        item.is_tipikal ?? 0,

      is_active:
        item.is_active
    });

    setEditId(item.id_kategori);

    setOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus kategori?"
      );

    if (!confirmDelete) return;

    try {

    await axios.delete(
      `http://localhost:5000/kategori/${id}`,
      {
        headers: {
          id_user: user.id_user,
          role: user.role
        }
      }
    );

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        "Gagal menghapus kategori"
      );
    }
  };

  // ================= GROUP KATEGORI =================
    const groupedKategori = {

      Gedung:
        kategori.filter(
          (item) =>
            item.jenis_proyek === "Gedung"
        ),

      Rumah:
        kategori.filter(
          (item) =>
            item.jenis_proyek === "Rumah"
        ),

      "Pondasi Bawah":
        kategori.filter(
          (item) =>
            item.jenis_proyek ===
            "Pondasi Bawah"
        )
    };

  return (
    <MainLayout title="Kategori Dokumen">

      {/* ================= STICKY HEADER ================= */}
      <Box
        sx={{
          position: "sticky",
          top: 10,
          zIndex: 100,
          bgcolor: "#F4F6F8",
          pb: 2
        }}
      >

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={handleOpen}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold"
            }}
          >
            Tambah Kategori
          </Button>

        </Box>

      </Box>

      {/* ================= LIST ================= */}
      <Card
        sx={{
          borderRadius: 3,
          p: 2,

          height: "calc(100vh - 220px)",

          overflowY: "auto"
        }}
      >

        {Object.entries(
        groupedKategori
      ).map(
        ([group, items]) => (

          <Box key={group}>

            {/* ================= HEADER GROUP ================= */}
            <Typography
              fontWeight="bold"
              fontSize={18}
              sx={{
                mb: 2,
                mt: 2
              }}
            >
              {group}
            </Typography>

           {/* ================= GROUP BIDANG ================= */}
            {bidangList.map((bidang) => {

              const bidangItems =
                items.filter(
                  (item) =>
                    item.bidang === bidang
                );

              // 🔥 SKIP KALAU KOSONG
              if (bidangItems.length === 0)
                return null;

              return (

                <Box
                  key={bidang}
                  sx={{ mb: 4 }}
                >

                  {/* ================= HEADER BIDANG ================= */}
                  <Typography
                    fontWeight="bold"
                    fontSize={16}
                    sx={{
                      color: "#1976d2",
                      mb: 1
                    }}
                  >
                    {bidang}
                  </Typography>

                  {/* ================= LIST ITEM ================= */}
                  {bidangItems.map(
                    (item) => (

                      <Box
                        key={item.id_kategori}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          py: 1.2,
                          px: 1,
                          borderRadius: 2,

                          "&:hover": {
                            bgcolor:
                              "#f5f5f5"
                          }
                        }}
                      >

                        {/* ================= INFO ================= */}
                          <Box>

                            <Typography
                              fontSize={15}
                            >
                              • {item.jenis_form}
                              {" - "}
                              {item.item_pekerjaan}
                            </Typography>

                            {item.is_tipikal === 1 && (

                              <Typography
                                variant="body2"
                                color="primary"
                                sx={{ ml: 2 }}
                              >
                                Tipikal
                              </Typography>
                            )}

                          </Box>

                        {/* ================= ACTION ================= */}
                        <Box>

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEdit(item)
                            }
                          >
                            <EditOutlinedIcon
                              fontSize="small"
                            />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(
                                item.id_kategori
                              )
                            }
                          >
                            <DeleteOutlineOutlinedIcon
                              fontSize="small"
                            />
                          </IconButton>

                        </Box>

                      </Box>
                    )
                  )}

                </Box>
              );
            })}
          </Box>
        )
      )}

      </Card>

      {/* ================= MODAL ================= */}
      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          {editId
            ? "Edit Kategori"
            : "Tambah Kategori"}
        </DialogTitle>

        <DialogContent>

          <TextField
            select
            fullWidth
            label="Jenis Proyek"
            value={form.jenis_proyek}
            onChange={(e) =>
              setForm({
                ...form,
                jenis_proyek:
                  e.target.value
              })
            }
            sx={{ mt: 2 }}
          >

            {jenisProyekList.map(
              (item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              )
            )}

          </TextField>

          <TextField
            select
            fullWidth
            label="Bidang"
            value={form.bidang}
            onChange={(e) =>
              setForm({
                ...form,
                bidang:
                  e.target.value
              })
            }
            sx={{ mt: 2 }}
          >

            {bidangList.map(
              (item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              )
            )}

          </TextField>

          <TextField
            select
            fullWidth
            label="Jenis Form"
            value={form.jenis_form}
            onChange={(e) =>
              setForm({
                ...form,
                jenis_form:
                  e.target.value
              })
            }
            sx={{ mt: 2 }}
          >

            {jenisFormList.map(
              (item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              )
            )}

          </TextField>

          <TextField
            fullWidth
            label="Item Pekerjaan"
            value={form.item_pekerjaan}
            onChange={(e) =>
              setForm({
                ...form,
                item_pekerjaan:
                  e.target.value
              })
            }
            sx={{ mt: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox

                checked={
                  form.is_tipikal === 1
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    is_tipikal:
                      e.target.checked
                        ? 1
                        : 0
                  })
                }
              />
            }

            label="Pekerjaan Tipikal"
          />

          <TextField
            fullWidth
            label="Nama Kategori"
            value={form.nama_kategori}
            onChange={(e) =>
              setForm({
                ...form,
                nama_kategori:
                  e.target.value
              })
            }
            sx={{ mt: 2 }}
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Batal
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Simpan
          </Button>

        </DialogActions>

      </Dialog>

    </MainLayout>
  );
}