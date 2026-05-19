import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

export default function Dashboard() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {

    fetch(
      "http://localhost:5000/dokumen",
      {
        headers: {
          id_user: user?.id_user,
          role: user?.role
        }
      }
    )
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.log(err));

    fetch("http://localhost:5000/log")
      .then((res) => res.json())
      .then((data) => setActivities(data.slice(0, 7)))
      .catch((err) => console.log(err));

    fetch("http://localhost:5000/proyek")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.log(err));

  }, [user]);

// ================= HANDLE PROJECT CLICK =================
const handleProjectClick = (project) => {

  // 🔥 ADMIN & DIREKTUR
  if (user?.role !== "pengawas") {

    navigate(
      `/monitoring/${encodeURIComponent(
        project.nama_proyek
      )}`
    );

    return;
  }

  // 🔥 CEK DARI DOKUMEN MILIK PENGAWAS
  const isAllowed =
    documents.some(
      (doc) =>
        doc.nama_proyek ===
        project.nama_proyek
    );

  // 🔥 JIKA BUKAN PROYEK DIA
  if (!isAllowed) {

    alert(
      "Anda tidak mengawasi proyek ini"
    );

    return;
  }

  // 🔥 JIKA SESUAI
  navigate(
    `/monitoring/${encodeURIComponent(
      project.nama_proyek
    )}`
  );
};

  // ================= SUMMARY =================
  const totalFinal = documents.filter(
    (doc) => doc.status === "Final"
  ).length;

  const totalRevisi = documents.filter(
    (doc) => doc.status === "Perlu Revisi"
  ).length;

  const totalObsolete = documents.filter(
    (doc) => doc.status === "Obsolete"
  ).length;

  // ================= UPLOAD HARI INI =================
  const uploadHariIni = documents.filter((doc) => {

    const today = new Date().toDateString();

    return (
      new Date(doc.created_at).toDateString() === today
    );

  }).length;

  const summaryData = [
    {
      label: "Dokumen Final",
      value: totalFinal,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />,
      color: "#2E7D32",
      bg: "#E8F5E9"
    },
    {
      label: "Perlu Revisi",
      value: totalRevisi,
      icon: <WarningAmberOutlinedIcon sx={{ fontSize: 30 }} />,
      color: "#ED6C02",
      bg: "#FFF3E0"
    },
    {
      label: "Obsolete",
      value: totalObsolete,
      icon: <DeleteOutlineIcon sx={{ fontSize: 30 }} />,
      color: "#D32F2F",
      bg: "#FFEBEE"
    },
    {
      label: "Total Dokumen",
      value: documents.length,
      icon: <InsertChartOutlinedIcon sx={{ fontSize: 30 }} />,
      color: "#0F4C81",
      bg: "#E3F2FD"
    },
    {
      label: "Upload Hari Ini",
      value: uploadHariIni,
      icon: <UploadFileOutlinedIcon sx={{ fontSize: 30 }} />,
      color: "#6A1B9A",
      bg: "#F3E5F5"
    }
  ];

  // ================= STATUS COLOR =================
  const getColor = (status) => {

    switch (status) {

      case "Final":
        return "#2E7D32";

      case "Perlu Revisi":
        return "#ED6C02";

      case "Obsolete":
        return "#D32F2F";

      default:
        return "#0F4C81";
    }
  };

  // ================= ACTIVITY ICON =================
  const getActivityIcon = (aktivitas) => {

    if (aktivitas?.includes("Upload")) {
      return (
        <DescriptionOutlinedIcon fontSize="small" />
      );
    }

    if (aktivitas?.includes("Status")) {
      return (
        <SyncAltOutlinedIcon fontSize="small" />
      );
    }

    if (aktivitas?.includes("Hapus")) {
      return (
        <DeleteOutlineOutlinedIcon fontSize="small" />
      );
    }

    if (aktivitas?.includes("Update")) {
      return (
        <EditOutlinedIcon fontSize="small" />
      );
    }

    return (
      <DescriptionOutlinedIcon fontSize="small" />
    );
  };

  return (
    <MainLayout title="Dashboard">

      {/* ================= SUMMARY ================= */}
      <Grid
        container
        spacing={2}
        sx={{ mb: 4 }}
      >

        {summaryData.map((item, index) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={2.4}
            key={index}
          >

            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 2,
                height: 110,
                display: "flex",
                alignItems: "center"
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

                  {/* ICON */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: item.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* INFO */}
                  <Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight="bold"
                    >
                      {item.value}
                    </Typography>

                  </Box>

                </Box>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

      {/* ================= CONTENT GRID ================= */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 4,
          flexDirection: { xs: "column", lg: "row" },
          width: "100%"
        }}
      >

        {/* ================= DOKUMEN TERBARU ================= */}
        <Box sx={{ flex: "0 0 66.666%", minWidth: 0 }}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              height: "100%"
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Dokumen Terbaru
              </Typography>

              {documents.slice(0, 6).map((doc, index) => (

                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#F8FAFC",
                    mb: 2
                  }}
                >

                  <Box display="flex" gap={2}>

                    {/* ICON */}
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        bgcolor: "#E3F2FD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0F4C81",
                        flexShrink: 0
                      }}
                    >
                      <DescriptionOutlinedIcon fontSize="small" />
                    </Box>

                    {/* CONTENT */}
                    <Box>

                      <Typography fontWeight="bold">
                        {doc.nama_dokumen}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {doc.nama_proyek}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(doc.created_at).toLocaleString()}
                      </Typography>

                    </Box>

                  </Box>

                  {/* STATUS */}
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 5,
                      flexShrink: 0,
                      bgcolor:
                        doc.status === "Final"
                          ? "#E8F5E9"
                          : doc.status === "Perlu Revisi"
                          ? "#FFF3E0"
                          : "#FFEBEE",
                      color:
                        doc.status === "Final"
                          ? "#2E7D32"
                          : doc.status === "Perlu Revisi"
                          ? "#ED6C02"
                          : "#D32F2F",
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    {doc.status}
                  </Box>

                </Box>

              ))}

            </CardContent>

          </Card>

        </Box>

        {/* ================= AKTIVITAS ================= */}
        <Box sx={{ flex: 1, minWidth: 0 }}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              height: "100%"
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Aktivitas Terkini
              </Typography>

              {activities.length > 0 ? (

                activities.map((activity, index) => (

                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 3
                    }}
                  >

                    {/* ICON */}
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 3,
                        bgcolor: "#F5F7FB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: getColor(activity.status_baru),
                        flexShrink: 0
                      }}
                    >
                      {getActivityIcon(activity.aktivitas)}
                    </Box>

                    {/* CONTENT */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>

                      <Typography fontWeight="bold">
                        {activity.aktivitas}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {activity.nama_dokumen || "Dokumen"}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {activity.nama_lengkap || "User"}
                        {activity.timestamp && (
                          <>
                            {" "}•{" "}
                            {new Date(activity.timestamp).toLocaleString()}
                          </>
                        )}
                      </Typography>

                    </Box>

                  </Box>

                ))

              ) : (

                <Typography color="text.secondary">
                  Belum ada aktivitas
                </Typography>

              )}

            </CardContent>

          </Card>

        </Box>

      </Box>

      {/* ================= PROYEK BERJALAN ================= */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 2,
          width: "100%"
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            Proyek Berjalan
          </Typography>

          <Grid
            container
            spacing={3}
            direction="column"
          >

            {projects.map((project, index) => (

              <Grid item xs={12} key={index}>

                <Card
                  onClick={() =>
                    handleProjectClick(project)
                  }
                  sx={{
                    borderRadius: 4,
                    boxShadow: 1,
                    transition: "0.2s",
                    bgcolor: "#F8FAFC",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                      bgcolor: "#F1F5F9"
                    }
                  }}
                >

                  <CardContent>

                    {/* HEADER */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={3}
                    >

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2
                        }}
                      >

                        {/* ICON */}
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: "#E3F2FD",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#1565C0",
                            flexShrink: 0
                          }}
                        >
                          <InsertChartOutlinedIcon />
                        </Box>

                        {/* NAMA & LOKASI */}
                        <Box>

                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                          >
                            {project.nama_proyek}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              lineHeight: 1.6
                            }}
                          >
                            {project.lokasi || "Lokasi belum tersedia"}
                          </Typography>

                        </Box>

                      </Box>

                      {/* STATUS */}
                      <Box
                        sx={{
                          px: 2,
                          py: 0.7,
                          borderRadius: 5,
                          bgcolor:
                            project.status_proyek === "Aktif"
                              ? "#E8F5E9"
                              : "#FFEBEE",
                          color:
                            project.status_proyek === "Aktif"
                              ? "#2E7D32"
                              : "#D32F2F",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {project.status_proyek || "Aktif"}
                      </Box>

                    </Box>

                    {/* STATISTIK */}
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        mt: 1,
                        pt: 2,
                        borderTop: "1px solid #E5E7EB"
                      }}
                    >

                      {/* TOTAL DOKUMEN */}
                      <Grid item xs={12} sm={3}>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Total Dokumen
                        </Typography>

                        <Typography
                          fontWeight="bold"
                          fontSize={22}
                        >
                          {
                            documents.filter(
                              (d) =>
                                d.nama_proyek === project.nama_proyek
                            ).length
                          }
                        </Typography>

                      </Grid>

                      {/* FINAL */}
                      <Grid item xs={12} sm={3}>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Dokumen Final
                        </Typography>

                        <Typography
                          fontWeight="bold"
                          fontSize={22}
                          color="#2E7D32"
                        >
                          {
                            documents.filter(
                              (d) =>
                                d.nama_proyek === project.nama_proyek &&
                                d.status === "Final"
                            ).length
                          }
                        </Typography>

                      </Grid>

                      {/* REVISI */}
                      <Grid item xs={12} sm={3}>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Perlu Revisi
                        </Typography>

                        <Typography
                          fontWeight="bold"
                          fontSize={22}
                          color="#ED6C02"
                        >
                          {
                            documents.filter(
                              (d) =>
                                d.nama_proyek === project.nama_proyek &&
                                d.status === "Perlu Revisi"
                            ).length
                          }
                        </Typography>

                      </Grid>

                      {/* UPDATE */}
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        sx={{
                          textAlign: {
                            xs: "left",
                            sm: "right"
                          }
                        }}
                      >

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Update Terakhir
                        </Typography>

                        <Typography
                          fontWeight="bold"
                          sx={{
                            mt: 1,
                            fontSize: 16
                          }}
                        >
                          {new Date(
                            project.created_at
                          ).toLocaleDateString()}
                        </Typography>

                      </Grid>

                    </Grid>

                  </CardContent>

                </Card>

              </Grid>

            ))}

          </Grid>

        </CardContent>

      </Card>

    </MainLayout>
  );
}