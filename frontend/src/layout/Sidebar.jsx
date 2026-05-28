import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();

  const { user, logout } = useAuth();

  if (!user) return null;

  const role = user?.role;

  const menuItems = [

    {
      label: "Dashboard",
      path: "/",
      icon: <DashboardOutlinedIcon />
    },

    {
      label: "Monitoring",
      path: "/monitoring",
      icon: <MonitorOutlinedIcon />
    },

    ...(role === "admin"
      ? [
          {
            label: "Kelola Dokumen",
            path: "/dokumen",
            icon: <DescriptionOutlinedIcon />
          },

          {
            label: "Manajemen Proyek",
            path: "/proyek",
            icon: <FolderOutlinedIcon />
          },

          {
            label: "Kategori Dokumen",
            path: "/kategori",
            icon: <CategoryOutlinedIcon />
          }
        ]
      : []),

    ...(role === "admin"
      ? [
          {
            label: "Kelola User",
            path: "/users",
            icon: <PeopleOutlinedIcon />
          }
        ]
      : []),

    {
      label: "Log Aktivitas",
      path: "/log-aktivitas",
      icon: <HistoryOutlinedIcon />
    }
  ];

  // ================= LOGOUT =================
  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "#0F4C81",
        color: "white",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 1200
      }}
    >

      {/* ================= TOP ================= */}
      <Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Welcons DMS
        </Typography>

        <List>

          {menuItems.map((item) => (

            <ListItemButton
              key={item.path}
              onClick={() =>
                navigate(item.path)
              }
              selected={
                location.pathname === item.path
              }
              sx={{
                borderRadius: 2,
                mb: 1,
                transition: "0.2s",

                "&.Mui-selected": {
                  bgcolor:
                    "rgba(255,255,255,0.2)"
                },

                "&:hover": {
                  bgcolor:
                    "rgba(255,255,255,0.12)"
                }
              }}
            >

              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
              />

            </ListItemButton>

          ))}

        </List>

      </Box>

      {/* ================= BOTTOM ================= */}
      <Box>

        <Divider
          sx={{
            mb: 2,
            borderColor:
              "rgba(255,255,255,0.2)"
          }}
        />

        <Button
          fullWidth
          startIcon={
            <LogoutOutlinedIcon />
          }
          sx={{
            color: "white",
            justifyContent: "flex-start",
            borderRadius: 2,
            py: 1.2,

            "&:hover": {
              bgcolor:
                "rgba(255,255,255,0.12)"
            }
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>

      </Box>

    </Box>
  );
}