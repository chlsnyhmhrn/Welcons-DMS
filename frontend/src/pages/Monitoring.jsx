import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack
} from "@mui/material";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { useAuth } from "../context/AuthContext";

export default function Monitoring() {

  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const [documents, setDocuments] = useState([]);

  const [proyek, setProyek] = useState([]);

  // ================= PREVENT BLANK =================
  if (loading) return null;

  if (!user) return null;

  // ================= FETCH DOKUMEN =================
  const fetchDokumen = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/dokumen",
        {
          headers: {
            id_user:
              user.id_user,

            role:
              user.role
          }
        }
      );

      const data = await res.json();

      setDocuments(data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchDokumen();

    fetchProyek();

  }, []);

  // ================= FETCH PROYEK =================
    const fetchProyek = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/proyek"
        );

        const data =
          await res.json();

        setProyek(data);

      } catch (err) {

        console.log(err);
      }
    };

  // ================= MONITORING PROYEK =================
    const proyekMonitoring = useMemo(() => {

      return proyek.map((p) => {

        const dokumenProyek =
          documents.filter(
            (d) =>
              d.id_proyek ===
              p.id_proyek
          );

        return {

          ...p,

          total_dokumen:
            dokumenProyek.length,

          total_final:
            dokumenProyek.filter(
              (d) =>
                d.status === "Final"
            ).length,

          total_revisi:
            dokumenProyek.filter(
              (d) =>
                d.status ===
                "Perlu Revisi"
            ).length,

          total_obsolete:
            dokumenProyek.filter(
              (d) =>
                d.status ===
                "Obsolete"
            ).length
        };

      });

    }, [proyek, documents]);

  // ================= UI =================
  return (
    <MainLayout title="Monitoring Proyek">

      {/* ================= SUMMARY ================= */}
      <Grid container spacing={3} sx={{ mb: 4 }}>

        <Grid item xs={12} md={4}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2
            }}
          >
            <CardContent>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <FolderOutlinedIcon
                  color="primary"
                  sx={{ fontSize: 40 }}
                />

                <Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Proyek
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                  >
                    {proyekMonitoring.length}
                  </Typography>

                </Box>

              </Stack>

            </CardContent>
          </Card>

        </Grid>

        <Grid item xs={12} md={4}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2
            }}
          >
            <CardContent>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <DescriptionOutlinedIcon
                  color="success"
                  sx={{ fontSize: 40 }}
                />

                <Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Dokumen
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                  >
                    {documents.length}
                  </Typography>

                </Box>

              </Stack>

            </CardContent>
          </Card>

        </Grid>

        <Grid item xs={12} md={4}>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2
            }}
          >
            <CardContent>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <CheckCircleOutlineOutlinedIcon
                  color="success"
                  sx={{ fontSize: 40 }}
                />

                <Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Dokumen Final
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                  >
                    {
                      documents.filter(
                        (d) => d.status === "Final"
                      ).length
                    }
                  </Typography>

                </Box>

              </Stack>

            </CardContent>
          </Card>

        </Grid>

      </Grid>

      {/* ================= LIST PROYEK ================= */}
      <Grid container spacing={3}>

        {proyekMonitoring.map((item, index) => {

          return (

            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              key={index}
            >

              <Card
                sx={{
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "0.2s",
                  boxShadow: 2,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 5
                  }
                }}
                onClick={() =>
                  navigate(
                    `/monitoring/${encodeURIComponent(item.nama_proyek)}`
                  )
                }
              >

                <CardContent>

                  {/* HEADER */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      {item.nama_proyek}
                    </Typography>

                  </Box>

                  {/* TOTAL */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                  >
                    {item.total_dokumen} dokumen terupload
                  </Typography>

                  {/* STATUS */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    flexWrap="wrap"
                    useFlexGap
                  >

                    <Chip
                      icon={<CheckCircleOutlineOutlinedIcon />}
                      label={`${item.total_final} Final`}
                      color="success"
                      size="small"
                    />

                    <Chip
                      icon={<WarningAmberOutlinedIcon />}
                      label={`${item.total_revisi} Revisi`}
                      color="warning"
                      size="small"
                    />

                    <Chip
                      label={`${item.total_obsolete} Obsolete`}
                      color="error"
                      size="small"
                    />

                  </Stack>

                </CardContent>

              </Card>

            </Grid>
          );
        })}

      </Grid>

    </MainLayout>
  );
}
