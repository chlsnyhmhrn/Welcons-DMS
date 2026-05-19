import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0F4C81" },
    success: { main: "#06A77D" },
    warning: { main: "#F4B942" },
    error: { main: "#E63946" },
    background: { default: "#F9FAFB" }
  },
  typography: {
    fontFamily: "Segoe UI, Roboto, sans-serif"
  },
  shape: {
    borderRadius: 12
  }
});

export default theme;
