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
    is_active: 1
  });

  const [editId, setEditId] = useState(null);

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
      is_active: 1
    });

    setEditId(null);

    setOpen(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    // ================= VALIDASI FIELD =================
    if (!form.nama_kategori.trim()) {

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
          {
            nama_kategori:
              form.nama_kategori,

            is_active:
              form.is_active ?? 1
          }
        );

      } else {

        // ================= TAMBAH =================
        await axios.post(
          "http://localhost:5000/kategori",
          {
            nama_kategori:
              form.nama_kategori
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
        `http://localhost:5000/kategori/${id}`
      );

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        "Gagal menghapus kategori"
      );
    }
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

        {kategori.map((item) => (

          <Box key={item.id_kategori}>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={2}
            >

              {/* ================= INFO ================= */}
              <Box>

                <Typography
                  fontWeight="bold"
                  fontSize={16}
                >
                  {item.nama_kategori}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {item.kode_kategori}
                </Typography>

              </Box>

              {/* ================= ACTION ================= */}
              <Box>

                {/* EDIT */}
                <IconButton
                  onClick={() =>
                    handleEdit(item)
                  }
                >
                  <EditOutlinedIcon />
                </IconButton>

                {/* DELETE */}
                <IconButton
                  color="error"
                  onClick={() =>
                    handleDelete(
                      item.id_kategori
                    )
                  }
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>

              </Box>

            </Box>

            <Divider />

          </Box>

        ))}

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