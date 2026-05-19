import { Box } from "@mui/material";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({
  children,
  title
}) {

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F4F6F8"
      }}
    >

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= CONTENT ================= */}
      <Box
        sx={{
          flex: 1,

          ml: "240px",

          width: "100%",

          minWidth: 0,

          px: 4,

          pt: 12,

          pb: 3,

          bgcolor: "#F4F6F8",

          overflowX: "hidden"
        }}
      >

        {/* HEADER */}
        <Header title={title} />

        {/* PAGE CONTENT */}
        <Box>

          {children}

        </Box>

      </Box>

    </Box>
  );
}