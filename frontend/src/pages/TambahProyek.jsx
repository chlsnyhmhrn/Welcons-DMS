import { useState } from "react";
import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Card,
  CardContent
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";

export default function TambahProyek() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    kode_proyek: "",
    nama_proyek: "",
    lokasi: "",
    tanggal_mulai: "",
    status_proyek: "Aktif",
    deskripsi: ""
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= SUBMIT =================
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

      // ================= CEK DUPLIKAT =================
      const resCheck = await fetch(
        "http://localhost:5000/proyek"
      );

      const proyekList =
        await resCheck.json();

      const isDuplicate =
        proyekList.some(
          (p) =>
            p.kode_proyek
              .toLowerCase()
              .trim() ===
              form.kode_proyek
                .toLowerCase()
                .trim() ||

            p.nama_proyek
              .toLowerCase()
              .trim() ===
              form.nama_proyek
                .toLowerCase()
                .trim()
        );

      if (isDuplicate) {

        alert(
          "Kode proyek atau nama proyek sudah digunakan"
        );

        return;
      }

      // ================= SIMPAN =================
      await fetch(
        "http://localhost:5000/proyek",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      alert(
        "Proyek berhasil ditambahkan"
      );

      navigate("/proyek");

    } catch (err) {

      console.log(err);

      alert(
        "Gagal menambahkan proyek"
      );
    }
  };

  return (
    <MainLayout title="Tambah Proyek">

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
                Tambah Proyek
              </Typography>

              <IconButton
                onClick={() => navigate("/proyek")}
              >
                <CloseIcon />
              </IconButton>

            </Box>

            {/* KODE PROYEK */}
            <TextField
              fullWidth
              label="Kode Proyek"
              name="kode_proyek"
              value={form.kode_proyek}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* NAMA PROYEK */}
            <TextField
              fullWidth
              label="Nama Proyek"
              name="nama_proyek"
              value={form.nama_proyek}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* LOKASI */}
            <TextField
              fullWidth
              label="Lokasi"
              name="lokasi"
              value={form.lokasi}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* TANGGAL MULAI */}
            <TextField
              fullWidth
              type="date"
              label="Tanggal Mulai"
              name="tanggal_mulai"
              value={form.tanggal_mulai}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputLabelProps={{
                shrink: true
              }}
            />

            {/* STATUS */}
            <TextField
              select
              fullWidth
              label="Status Proyek"
              name="status_proyek"
              value={form.status_proyek}
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
              value={form.deskripsi}
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
              Simpan Proyek
            </Button>

          </CardContent>

        </Card>

      </Box>

    </MainLayout>
  );
}