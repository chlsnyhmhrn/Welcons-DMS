import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import axios from "axios";

export default function UploadDokumen() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [form, setForm] = useState({
    nama_dokumen: "",
    id_proyek: "",
    id_kategori: "",
    item_pekerjaan: "",
    status: "Perlu Revisi",
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [proyekList, setProyekList] = useState([]);

  const [kategoriList, setKategoriList] = useState([]);

  // ================= FETCH DROPDOWN =================
  useEffect(() => {

    const fetchData = async () => {

      try {

        const proyekRes = await axios.get(
          "http://localhost:5000/proyek"
        );

        const kategoriRes = await axios.get(
          "http://localhost:5000/kategori"
        );

        // 🔥 HANYA PROYEK AKTIF
        setProyekList(
          (proyekRes.data || []).filter(
            (project) =>
              project.status_proyek === "Aktif"
          )
        );

        setKategoriList(kategoriRes.data || []);

      } catch (err) {

        console.error(err);
      }
    };

    fetchData();

  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    if (loading) return;

    if (!file)
      return alert("File wajib dipilih!");

          // ================= VALIDASI FORMAT FILE =================
      const allowedFormats = [
        "application/pdf",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "image/vnd.dwg",

        "application/acad",

        "application/x-acad",

        "application/autocad_dwg",

        "application/dwg",

        "drawing/dwg"
      ];

      const fileExtension =
        file.name
          .split(".")
          .pop()
          .toLowerCase();

      const allowedExtensions = [
        "pdf",
        "docx",
        "xlsx",
        "dwg"
      ];

      if (
        !allowedFormats.includes(file.type) &&
        !allowedExtensions.includes(fileExtension)
      ) {

        return alert(
          "Format file harus PDF, DOCX, XLSX, atau DWG"
        );
      }

    if (!form.nama_dokumen)
      return alert("Nama dokumen wajib diisi!");

    if (
      !form.id_proyek ||
      !form.id_kategori ||
      !form.item_pekerjaan
    ) {
      return alert(
        "Proyek dan kategori wajib dipilih!"
      );
    }

    setLoading(true);

    const formData = new FormData();

    formData.append(
      "nama_dokumen",
      form.nama_dokumen
    );

    formData.append(
      "id_proyek",
      form.id_proyek
    );

    formData.append(
      "id_kategori",
      form.id_kategori
    );

    formData.append(
      "item_pekerjaan",
      form.item_pekerjaan
    );

    formData.append(
      "status",
      form.status
    );

    formData.append(
      "uploaded_by",
      user?.id || ""
    );

    formData.append("file", file);

    try {

      const res = await fetch(
        "http://localhost:5000/dokumen/upload",
        {
          method: "POST",

          headers: {
            id_user: user.id_user,
            role: user.role
          },

          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {

        throw new Error(
          result.message || "Upload gagal"
        );
      }

      alert(
        result.message || "Upload berhasil"
      );

      navigate("/dokumen");

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <MainLayout title="Upload Dokumen">

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
                Upload Dokumen
              </Typography>

              <IconButton
                onClick={() =>
                  navigate("/dokumen")
                }
              >
                <CloseIcon />
              </IconButton>

            </Box>

            {/* NAMA DOKUMEN */}
            <TextField
              fullWidth
              label="Nama Dokumen"
              name="nama_dokumen"
              value={form.nama_dokumen}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* PROYEK */}
            <TextField
              select
              fullWidth
              label="Pilih Proyek"
              name="id_proyek"
              value={form.id_proyek}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >

              {proyekList.map((item) => (

                <MenuItem
                  key={item.id_proyek}
                  value={item.id_proyek}
                >
                  {item.nama_proyek}
                </MenuItem>

              ))}

            </TextField>

            {/* KATEGORI */}
            <TextField
              select
              fullWidth
              label="Pilih Kategori"
              name="id_kategori"
              value={form.id_kategori}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >

              {kategoriList.map((item) => (

                <MenuItem
                  key={item.id_kategori}
                  value={item.id_kategori}
                >
                  {item.nama_kategori}
                </MenuItem>

              ))}

            </TextField>

            {/* ITEM PEKERJAAN */}
            <TextField
              fullWidth
              label="Item Pekerjaan"
              name="item_pekerjaan"
              value={form.item_pekerjaan}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* STATUS */}
            <TextField
              select
              fullWidth
              label="Status Dokumen"
              name="status"
              value={form.status}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >

              <MenuItem value="Perlu Revisi">
                Perlu Revisi
              </MenuItem>

              <MenuItem value="Final">
                Final
              </MenuItem>

              <MenuItem value="Obsolete">
                Obsolete
              </MenuItem>

            </TextField>

            {/* FILE */}
            <Button
              variant="outlined"
              component="label"
              sx={{
                mb: 2,
                borderRadius: 3,
                textTransform: "none"
              }}
            >
              Pilih File

              <input
                type="file"
                hidden
                onChange={(e) =>
                  setFile(
                    e.target.files[0]
                  )
                }
              />

            </Button>

            {file && (

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                {file.name}
              </Typography>

            )}

            {/* BUTTON */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold"
              }}
            >
              {loading
                ? "Uploading..."
                : "Upload Dokumen"}
            </Button>

          </CardContent>

        </Card>

      </Box>

    </MainLayout>
  );
}