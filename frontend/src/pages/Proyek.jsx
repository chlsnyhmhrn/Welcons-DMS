import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Chip
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

import { useNavigate } from "react-router-dom";

export default function Proyek() {

  const [proyek, setProyek] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FETCH DATA =================
  const fetchData = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/proyek"
      );

      if (!res.ok) {
        throw new Error(
          "Gagal fetch data proyek"
        );
      }

      const data = await res.json();

      setProyek(data);

    } catch (err) {

      console.error(
        "ERROR FETCH:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus proyek?"
      );

    if (!confirmDelete) return;

    try {

      await fetch(
        `http://localhost:5000/proyek/${id}`,
        {
          method: "DELETE"
        }
      );

      fetchData();

    } catch (err) {

      console.error(
        "ERROR DELETE:",
        err
      );

      alert("Gagal menghapus proyek");
    }
  };

  return (
    <MainLayout title="Kelola Proyek">

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
            onClick={() =>
              navigate("/tambah-proyek")
            }
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold"
            }}
          >
            Tambah Proyek
          </Button>

        </Box>

      </Box>

      {/* ================= LIST ================= */}
      <Box
        sx={{
          bgcolor: "white",
          p: 2,
          borderRadius: 3,
          boxShadow: 2,

          height: "calc(100vh - 220px)",

          overflowY: "auto"
        }}
      >

        {loading ? (

          <Box
            textAlign="center"
            py={3}
          >
            <CircularProgress />
          </Box>

        ) : proyek.length > 0 ? (

          proyek.map((item) => (

            <Box key={item.id_proyek}>

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
                    fontSize={17}
                  >
                    {item.nama_proyek}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {item.kode_proyek}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {item.lokasi}
                  </Typography>

                  <Box mt={1}>

                    <Chip
                      label={item.status_proyek}
                      size="small"
                      sx={{
                        bgcolor:
                          item.status_proyek ===
                          "Aktif"
                            ? "#E8F5E9"
                            : "#FFEBEE",

                        color:
                          item.status_proyek ===
                          "Aktif"
                            ? "#2E7D32"
                            : "#D32F2F",

                        fontWeight: "bold"
                      }}
                    />

                  </Box>

                </Box>

                {/* ================= ACTION ================= */}
                <Box>

                  {/* EDIT */}
                  <IconButton
                    color="primary"
                    onClick={() =>
                      navigate(
                        `/edit-proyek/${item.id_proyek}`
                      )
                    }
                  >
                    <EditOutlinedIcon />
                  </IconButton>

                  {/* DELETE */}
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDelete(
                        item.id_proyek
                      )
                    }
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>

                </Box>

              </Box>

              <Divider />

            </Box>

          ))

        ) : (

          <Typography textAlign="center">
            Tidak ada proyek
          </Typography>

        )}

      </Box>

    </MainLayout>
  );
}