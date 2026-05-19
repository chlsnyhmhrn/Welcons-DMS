import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge,
  Chip,
  Button
} from "@mui/material";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Header({ title }) {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [unreadCount, setUnreadCount] =
    useState(0);

  // ================= FETCH NOTIF =================
  useEffect(() => {

    if (!user?.role) return;

    const fetchNotif = () => {

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

          // 🔥 AMBIL LAST READ ID
          const lastReadId =
            Number(
              localStorage.getItem(
                `lastReadNotif_${user.id_user}`
              ) || 0
            );

          // 🔥 FILTER UNREAD
          const unread =
            data.filter(
              (item) =>
                Number(item.id_log) >
                lastReadId
            );

          setUnreadCount(
            unread.length
          );
        })

        .catch((err) => {

          console.log(err);

          setUnreadCount(0);
        });
    };

    // 🔥 LOAD AWAL
    fetchNotif();

    // 🔥 AUTO REFRESH
    const interval =
      setInterval(fetchNotif, 2000);

    return () =>
      clearInterval(interval);

  }, [
    location.pathname,
    user?.id_user
  ]);

  // ================= LOGOUT =================
  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  if (!user) {

    return (
      <Box sx={{ p: 2 }}>
        <Typography>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",

        top: 5,

        left: "272px",

        right: "32px",

        zIndex: 1100,

        bgcolor: "white",

        p: 2,

        borderRadius: 3,

        boxShadow: 2,

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        backdropFilter: "blur(8px)"
      }}
    >

      {/* ================= LEFT ================= */}
      <Box>

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Sistem Monitoring Dokumen Proyek
        </Typography>

      </Box>

      {/* ================= RIGHT ================= */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
      >

        {/* ================= NOTIF ================= */}
        <IconButton
          onClick={() =>
            navigate("/notifikasi")
          }
        >

          <Badge
            badgeContent={unreadCount}
            color="error"
            showZero
            max={99}
          >

            <NotificationsOutlinedIcon />

          </Badge>

        </IconButton>

        {/* ================= USER ================= */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
        >

          <Avatar
            sx={{
              bgcolor: "#0F4C81"
            }}
          >
            {user?.nama_lengkap?.charAt(0) ||
              "U"}
          </Avatar>

          <Box>

            <Typography
              variant="body2"
              fontWeight="bold"
            >
              {user?.nama_lengkap}
            </Typography>

            <Chip
              label={user?.role}
              size="small"
              color="primary"
            />

          </Box>

        </Box>

        {/* ================= LOGOUT ================= */}
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            textTransform: "none"
          }}
        >
          Logout
        </Button>

      </Box>

    </Box>
  );
}