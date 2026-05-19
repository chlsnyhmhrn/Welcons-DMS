import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  IconButton,
  Divider
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function DetailDokumen() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [riwayat, setRiwayat] = useState([]);

  const [expandedId, setExpandedId] = useState(null);

  const [error, setError] = useState(null);

  // ================= GET DETAIL =================
  useEffect(() => {

    const fetchDetail = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/dokumen/${id}`
        );

        const json = await res.json();

        if (!res.ok) {

          throw new Error(
            "Gagal ambil detail"
          );
        }

        setData(json);

      } catch (err) {

        console.error(err);

        setError("Gagal mengambil data");
      }
    };

    fetchDetail();

  }, [id]);

  // ================= GET RIWAYAT =================
  useEffect(() => {

    const fetchRiwayat = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/dokumen/riwayat/${id}`
        );

        const json = await res.json();

        if (!res.ok) {

          throw new Error(
            "Gagal ambil riwayat"
          );
        }

        setRiwayat(json);

      } catch (err) {

        console.error(err);
      }
    };

    fetchRiwayat();

  }, [id]);

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {

    if (status === "Final")
      return "success";

    if (status === "Perlu Revisi")
      return "warning";

    if (status === "Obsolete")
      return "error";

    return "default";
  };

  // ================= VIEW FILE =================
  const handleView = (file) => {

    if (!file) return;

    window.open(
      `http://localhost:5000/uploads/${file}`,
      "_blank"
    );
  };

  // ================= LABEL VERSI =================
  const getLabel = (index, total) => {

    if (index === 0)
      return "Terbaru";

    if (index === total - 1)
      return "Awal";

    return "Revisi";
  };

  // ================= ERROR =================
  if (error) {

    return (
      <MainLayout title="Detail Dokumen">

        <Typography color="error">
          {error}
        </Typography>

      </MainLayout>
    );
  }

  // ================= LOADING =================
  if (!data) {

    return (
      <MainLayout title="Detail Dokumen">

        <Typography>
          Loading...
        </Typography>

      </MainLayout>
    );
  }

  // ================= UI =================
  return (
    <MainLayout title="Detail Dokumen">

      {/* ================= HEADER ================= */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={3}
      >

        <IconButton
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Detail Dokumen
        </Typography>

      </Box>

      {/* ================= DETAIL ================= */}
      <Card
        sx={{
          borderRadius: 4,
          mb: 4,
          boxShadow: 2
        }}
      >

        <CardContent
          sx={{
            p: 4
          }}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
          >
            {data.nama_dokumen}
          </Typography>

          <Grid container spacing={3}>

            {/* PROYEK */}
            <Grid item xs={12} md={6}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Proyek
              </Typography>

              <Typography
                fontWeight="bold"
                mt={0.5}
              >
                {data.nama_proyek || "-"}
              </Typography>

            </Grid>

            {/* KATEGORI */}
            <Grid item xs={12} md={6}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Kategori
              </Typography>

              <Typography
                fontWeight="bold"
                mt={0.5}
              >
                {data.nama_kategori || "-"}
              </Typography>

            </Grid>

            {/* VERSI */}
            <Grid item xs={12} md={6}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Versi
              </Typography>

              <Typography
                fontWeight="bold"
                mt={0.5}
              >
                v{data.versi}
              </Typography>

            </Grid>

            {/* STATUS */}
            <Grid item xs={12} md={6}>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Status
              </Typography>

              <Box mt={1}>

                <Chip
                  label={data.status}
                  color={getStatusColor(data.status)}
                />

              </Box>

            </Grid>

          </Grid>

          {/* BUTTON */}
          <Box mt={2}>

            <Button
              variant="contained"
              size="large"
              onClick={() =>
                handleView(data.nama_file)
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold"
              }}
            >
              Lihat File
            </Button>

          </Box>

        </CardContent>

      </Card>

      {/* ================= TIMELINE ================= */}
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

          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            Riwayat Versi Dokumen
          </Typography>

          <Box
            sx={{
              position: "relative",
              pl: 4
            }}
          >

            {/* GARIS */}
            <Box
              sx={{
                position: "absolute",
                left: 12,
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: "#ddd"
              }}
            />

            {riwayat.length > 0 ? (

              riwayat.map((item, index) => {

                const label = getLabel(
                  index,
                  riwayat.length
                );

                const isExpanded =
                  expandedId === item.id_dokumen;

                return (

                  <Box
                    key={item.id_dokumen}
                    sx={{
                      mb: 3,
                      position: "relative"
                    }}
                  >

                    {/* TITIK */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: -2,
                        top: 6,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor:
                          label === "Terbaru"
                            ? "success.main"
                            : label === "Awal"
                            ? "primary.main"
                            : "warning.main"
                      }}
                    />

                    {/* CARD */}
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border:
                          "1px solid #e0e0e0",
                        bgcolor: "#fff",
                        boxShadow:
                          isExpanded ? 3 : 1,
                        cursor: "pointer",
                        transition: "0.2s",
                        "&:hover": {
                          boxShadow: 3
                        }
                      }}
                      onClick={() =>
                        setExpandedId(
                          isExpanded
                            ? null
                            : item.id_dokumen
                        )
                      }
                    >

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={2}
                      >

                        {/* INFO */}
                        <Box>

                          <Typography
                            fontWeight="bold"
                          >
                            Versi {item.versi}

                            <Chip
                              label={label}
                              size="small"
                              sx={{ ml: 1 }}
                              color={
                                label === "Terbaru"
                                  ? "success"
                                  : label === "Awal"
                                  ? "primary"
                                  : "warning"
                              }
                            />

                          </Typography>

                          <Typography
                            variant="caption"
                            display="block"
                            mt={1}
                          >
                            📄 {item.nama_file}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {item.status}

                            {item.created_at && (
                              <>
                                {" "}
                                •{" "}
                                {new Date(
                                  item.created_at
                                ).toLocaleString()}
                              </>
                            )}

                          </Typography>

                        </Box>

                        {/* VIEW */}
                        <IconButton
                          onClick={(e) => {

                            e.stopPropagation();

                            handleView(
                              item.nama_file
                            );
                          }}
                        >
                          <VisibilityOutlinedIcon />
                        </IconButton>

                      </Box>

                      {/* EXPAND */}
                      {isExpanded && (

                        <Box
                          mt={2}
                          pt={2}
                          borderTop="1px solid #eee"
                        >

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Ini adalah versi ke-
                            {item.versi}
                            {" "}
                            dari dokumen ini.
                          </Typography>

                        </Box>

                      )}

                    </Box>

                    {index !==
                      riwayat.length - 1 && (

                      <Divider
                        sx={{ mt: 2 }}
                      />

                    )}

                  </Box>
                );
              })

            ) : (

              <Typography>
                Tidak ada riwayat
              </Typography>

            )}

          </Box>

        </CardContent>

      </Card>

    </MainLayout>
  );
}