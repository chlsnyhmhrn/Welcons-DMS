import { useEffect, useState } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Card,
  CardContent,
  IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { useParams, useNavigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

export default function EditProyek() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    kode_proyek: "",
    nama_proyek: "",
    lokasi: "",
    tanggal_mulai: "",
    status_proyek: "Aktif",
    deskripsi: ""
  });

  const [loading, setLoading] = useState(true);

  // ================= FETCH DETAIL =================
  useEffect(() => {

    const fetchDetail = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/proyek"
        );

        if (!res.ok) {

          throw new Error(
            "Gagal fetch data"
          );
        }

        const data = await res.json();

        const proyek = data.find(
          (p) =>
            String(p.id_proyek) === String(id)
        );

        if (proyek) {

          setForm({
            ...proyek,
            tanggal_mulai:
              proyek.tanggal_mulai?.slice(0, 10) || ""
          });
        }

      } catch (err) {

        console.error(
          "ERROR FETCH DETAIL:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    fetchDetail();

  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE =================
const handleSubmit = async () => {

  // ================= VALIDASI FIELD =================
  if (
    !form.kode_proyek ||
    !form.nama_proyek ||
    !form.lokasi ||
    !form.tanggal_mulai ||
    !form.status_proyek
  ) {

    alert(
      "Semua field wajib diisi"
    );

    return;
  }

  try {

    // ================= FETCH DATA =================
    const resCheck = await fetch(
      "http://localhost:5000/proyek"
    );

    const proyekList =
      await resCheck.json();

    // ================= CEK DUPLIKAT =================
    const isDuplicate =
      proyekList.some(
        (p) =>

          // 🔥 BUKAN DATA DIRI SENDIRI
          String(p.id_proyek) !==
            String(id) && (

            p.kode_proyek
              ?.toLowerCase()
              .trim() ===
              form.kode_proyek
                .toLowerCase()
                .trim() ||

            p.nama_proyek
              ?.toLowerCase()
              .trim() ===
              form.nama_proyek
                .toLowerCase()
                .trim()
          )
      );

    if (isDuplicate) {

      alert(
        "Kode proyek atau nama proyek sudah digunakan"
      );

      return;
    }

    // ================= UPDATE =================
    const res = await fetch(
      `http://localhost:5000/proyek/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify(form)
      }
    );

    if (!res.ok) {

      throw new Error(
        "Update gagal"
      );
    }

    alert(
      "Proyek berhasil diupdate"
    );

    navigate("/proyek");

  } catch (err) {

    console.error(
      "ERROR UPDATE:",
      err
    );

    alert(
      "Gagal update proyek"
    );
  }
};

  // ================= LOADING =================
  if (loading) {

    return (
      <Typography p={3}>
        Loading...
      </Typography>
    );
  }

  return (
    <MainLayout title="Edit Proyek">

      <Box
        sx={{
          maxWidth: 650,
          mx: "auto"
        }}
      >

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 2
          }}
        >

          <CardContent
            sx={{
              p: 4
            }}
          >

            {/* HEADER */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >

              <Typography
                variant="h5"
                fontWeight="bold"
              >
                Edit Proyek
              </Typography>

              <IconButton
                onClick={() =>
                  navigate("/proyek")
                }
              >
                <CloseIcon />
              </IconButton>

            </Box>

            {/* KODE */}
            <TextField
              fullWidth
              label="Kode Proyek"
              name="kode_proyek"
              value={form.kode_proyek || ""}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* NAMA */}
            <TextField
              fullWidth
              label="Nama Proyek"
              name="nama_proyek"
              value={form.nama_proyek || ""}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* LOKASI */}
            <TextField
              fullWidth
              label="Lokasi"
              name="lokasi"
              value={form.lokasi || ""}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* TANGGAL */}
            <TextField
              fullWidth
              type="date"
              label="Tanggal Mulai"
              name="tanggal_mulai"
              value={form.tanggal_mulai || ""}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              sx={{ mb: 3 }}
            />

            {/* STATUS */}
            <TextField
              select
              fullWidth
              label="Status Proyek"
              name="status_proyek"
              value={form.status_proyek || ""}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >

              <MenuItem value="Aktif">
                Aktif
              </MenuItem>

              <MenuItem value="Tidak Aktif">
                Tidak Aktif
              </MenuItem>

            </TextField>

            {/* DESKRIPSI */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Deskripsi"
              name="deskripsi"
              value={form.deskripsi || ""}
              onChange={handleChange}
              sx={{ mb: 4 }}
            />

            {/* BUTTON */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              sx={{
                py: 1.4,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold"
              }}
            >
              Update Proyek
            </Button>

          </CardContent>

        </Card>

      </Box>

    </MainLayout>
  );
}