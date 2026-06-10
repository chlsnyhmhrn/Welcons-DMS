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
import { useAuth } from "../context/AuthContext";

export default function TambahProyek() {

  const navigate = useNavigate();
  const { user } = useAuth();

const [form, setForm] = useState({

  nama_proyek: "",
  lokasi: "",
  tanggal_mulai: "",
  status_proyek: "Aktif",
  deskripsi: "",

  jenis_proyek: "",
  jumlah_lantai: "",

  bidang_pengawasan: []
});

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {

      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    };

    // ================= LIST BIDANG PENGAWASAN =================
    const bidangList = [
      "Struktur",
      "Arsitektur",
      "Plumbing",
      "Fire Fighting",
      "AC",
      "Elektrikal",
      "Elektronik"
    ];

    // ================= HANDLE CHECKLIST BIDANG =================
    const handleBidangChange = (bidang) => {

      const current =
        form.bidang_pengawasan;

      // 🔥 JIKA SUDAH DIPILIH → HAPUS
      const updated =
        current.includes(bidang)

          ? current.filter(
              (item) =>
                item !== bidang
            )

          // 🔥 JIKA BELUM → TAMBAH
          : [...current, bidang];

      setForm({
        ...form,
        bidang_pengawasan: updated
      });
    };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    // ================= VALIDASI FIELD =================
    if (
      !form.nama_proyek ||
      !form.lokasi ||
      !form.tanggal_mulai ||
      !form.status_proyek ||
      !form.jenis_proyek ||
      !form.jumlah_lantai ||
      form.bidang_pengawasan.length === 0
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
            p.nama_proyek
              .toLowerCase()
              .trim() ===
              form.nama_proyek
                .toLowerCase()
                .trim()
        );

      if (isDuplicate) {

        alert(
          "Nama proyek sudah digunakan"
        );

        return;
      }

      // ================= SIMPAN =================
      await fetch(
        "http://localhost:5000/proyek",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            id_user: user.id_user,
            role: user.role
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

            {/* JENIS PROYEK */}
            <TextField
              select
              fullWidth
              label="Jenis Proyek"
              name="jenis_proyek"
              value={form.jenis_proyek}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >

              <MenuItem value="Gedung">
                Gedung
              </MenuItem>

              <MenuItem value="Rumah">
                Rumah
              </MenuItem>

              <MenuItem value="Pondasi Bawah">
                Pondasi Bawah
              </MenuItem>

            </TextField>

            {/* JUMLAH LANTAI */}
            <TextField
              fullWidth
              type="number"
              label="Jumlah Lantai"
              name="jumlah_lantai"
              value={form.jumlah_lantai}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* BIDANG PENGAWASAN */}
            <Box sx={{ mb: 3 }}>

              <Typography
                fontWeight="bold"
                mb={1}
              >
                Bidang Pengawasan
              </Typography>

              <Box
                display="flex"
                flexWrap="wrap"
                gap={1}
              >

                {bidangList.map(
                  (bidang) => (

                    <Button
                      key={bidang}
                      variant={
                        form.bidang_pengawasan.includes(
                          bidang
                        )
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() =>
                        handleBidangChange(
                          bidang
                        )
                      }
                      sx={{
                        borderRadius: 3,
                        textTransform: "none"
                      }}
                    >
                      {bidang}
                    </Button>
                  )
                )}

              </Box>

            </Box>

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