import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {

    // ================= VALIDASI KOSONG =================
    if (!form.email || !form.password) {

      alert("Semua field wajib diisi");

      return;
    }

    // ================= VALIDASI FORMAT EMAIL =================
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {

      alert("Format email tidak valid");

      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (data.success) {

        login(data.user);

        navigate("/");

      } else {

        alert(data.message);
      }

    } catch (err) {

      console.log(err);

      alert("Server error");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#F4F6F8"
      }}
    >
      <Card sx={{ p: 4, width: 350, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          sx={{ mb: 2 }}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          sx={{ mb: 3 }}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
    </Box>
  );
}