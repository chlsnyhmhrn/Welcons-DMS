import { useEffect, useState } from "react";

import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  Card,
  Divider,
  Chip,
  Avatar
} from "@mui/material";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";

import { useAuth } from "../context/AuthContext";

export default function Notifikasi() {

  const { user } = useAuth();

  const [notifikasi, setNotifikasi] =
    useState([]);

  const [lastRead, setLastRead] =
    useState(0);

  // ================= FETCH =================
  useEffect(() => {

    if (!user?.role) return;

    // 🔥 AMBIL LAST READ ID
    const oldLastRead =
      Number(
        localStorage.getItem(
          `lastReadNotif_${user.id_user}`
        ) || 0
      );

    // 🔥 SIMPAN KE STATE
    setLastRead(oldLastRead);

    // 🔥 FETCH DATA
    fetch(
      "http://localhost:5000/log",
      {
        headers: {
          id_user:
            user.id_user,

          role:
            user.role
        }
      }
    )

      .then((res) => res.json())

      .then((data) => {

        console.log(
          "NOTIF:",
          data
        );

        setNotifikasi(data);
      })

      .catch((err) => {

        console.log(err);

        setNotifikasi([]);
      });

  }, [user?.role]);

  // ================= SAVE READ =================
  useEffect(() => {

    return () => {

      if (
        user?.role &&
        notifikasi.length > 0
      ) {

        // 🔥 AMBIL ID TERBARU
        const latestId =
          Math.max(
            ...notifikasi.map(
              (item) =>
                Number(item.id_log)
            )
          );

        // 🔥 SAVE LAST READ
        localStorage.setItem(
          `lastReadNotif_${user.id_user}`,
          latestId
        );
      }
    };

  }, [
    notifikasi,
    user?.role
  ]);

  // ================= ICON =================
  const getIcon = (aktivitas) => {

    if (
      aktivitas?.includes("Upload")
    ) {
      return (
        <DescriptionOutlinedIcon color="primary" />
      );
    }

    if (
      aktivitas?.includes("Revisi")
    ) {
      return (
        <EditOutlinedIcon color="warning" />
      );
    }

    if (
      aktivitas?.includes("Status")
    ) {
      return (
        <SyncAltOutlinedIcon color="success" />
      );
    }

    if (
      aktivitas?.includes("Hapus")
    ) {
      return (
        <DeleteOutlineOutlinedIcon color="error" />
      );
    }

    return (
      <NotificationsOutlinedIcon color="primary" />
    );
  };

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

  return (
    <MainLayout title="Notifikasi">

      {/* ================= HEADER ================= */}
      <Box
        sx={{
          position: "sticky",
          top: 10,
          zIndex: 100,
          bgcolor: "#F4F6F8",
          pb: 2
        }}
      >

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Notifikasi Aktivitas
        </Typography>

      </Box>

      {/* ================= LIST ================= */}
      <Card
        sx={{
          borderRadius: 4,
          p: 2,
          height: "calc(100vh - 220px)",
          overflowY: "auto",
          boxShadow: 2
        }}
      >

        {notifikasi.length > 0 ? (

          notifikasi.map((item, index) => {

            // 🔥 UNREAD BERDASARKAN ID
            const isUnread =
              Number(item.id_log) >
              lastRead;

            return (

              <Box
                key={item.id_log || index}
                sx={{

                  py: 2,

                  px: 2,

                  borderRadius: 3,

                  mb: 1,

                  transition: "0.2s",

                  bgcolor:
                    isUnread
                      ? "#EEF4FF"
                      : "white",

                  borderLeft:
                    isUnread
                      ? "5px solid #1976d2"
                      : "5px solid transparent"
                }}
              >

                <Box
                  display="flex"
                  gap={2}
                >

                  {/* ICON */}
                  <Avatar
                    sx={{
                      bgcolor: isUnread
                        ? "#DCEBFF"
                        : "#EEF4FF",

                      width: 46,
                      height: 46
                    }}
                  >
                    {getIcon(item.aktivitas)}
                  </Avatar>

                  {/* CONTENT */}
                  <Box flex={1}>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                    >

                      <Typography
                        fontWeight={
                          isUnread
                            ? "bold"
                            : "normal"
                        }
                      >
                        {item.aktivitas || "Aktivitas"}
                      </Typography>

                      {item.status_baru && (

                        <Chip
                          label={item.status_baru}
                          size="small"
                          color={getStatusColor(item.status_baru)}
                        />

                      )}

                    </Box>

                    {/* DESKRIPSI */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        lineHeight: 1.8
                      }}
                    >

                      <strong>
                        {item.nama_lengkap || "User"}
                      </strong>

                      {" "}

                      {item.aktivitas?.toLowerCase() || "melakukan aktivitas"}

                      {" "}

                      <strong>
                        {item.nama_dokumen || "dokumen"}
                      </strong>

                      {" pada proyek "}

                      <strong>
                        {item.nama_proyek || "-"}
                      </strong>

                    </Typography>

                    {/* KETERANGAN */}
                    {item.keterangan && (

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        📝 {item.keterangan}
                      </Typography>

                    )}

                    {/* TIME */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1.5}
                    >
                      {item.timestamp
                        ? new Date(
                            item.timestamp
                          ).toLocaleString()
                        : "-"}
                    </Typography>

                  </Box>

                </Box>

                {index !==
                  notifikasi.length -
                    1 && (

                  <Divider
                    sx={{ mt: 2 }}
                  />

                )}

              </Box>
            );
          })

        ) : (

          <Box
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >

            <Typography
              color="text.secondary"
            >
              Belum ada notifikasi
            </Typography>

          </Box>

        )}

      </Card>

    </MainLayout>
  );
}