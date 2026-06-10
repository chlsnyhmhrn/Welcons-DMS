import { useState, useEffect } from "react";

import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  Card,
  Divider,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useAuth } from "../context/AuthContext";

export default function Users() {

  const { user, loading } = useAuth();

  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);

  const [editId, setEditId] =
    useState(null);

  const [form, setForm] = useState({
    nama_lengkap: "",
    email: "",
    password: "",
    role: "pengawas",
  });

  // ================= PREVENT BLANK =================
  if (loading) return null;

  if (!user) return null;

  // ================= ROLE ACCESS =================
  if (user.role !== "admin") {

    return (
      <MainLayout title="Kelola User">

        <Typography>
          Anda tidak memiliki akses.
        </Typography>

      </MainLayout>
    );
  }

  // ================= GET USERS =================
  const fetchUsers = () => {

    fetch("http://localhost:5000/users")

      .then((res) => res.json())

      .then((data) => {

        console.log("USERS:", data);

        setUsers(data.data || data);
      })

      .catch((err) =>
        console.log(err)
      );
  };

  // ================= LOAD DATA =================
  useEffect(() => {

    fetchUsers();

  }, []);

  // ================= ADD USER =================
  const handleAdd = async () => {

    // ================= VALIDATION =================
    if (
      !form.nama_lengkap ||
      !form.email ||
      !form.password
    ) {

      alert(
        "Semua field wajib diisi"
      );

      return;
    }

    // ================= EMAIL VALIDATION =================
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(form.email)
    ) {

      alert(
        "Format email tidak valid"
      );

      return;
    }

    try {

    await fetch(
      "http://localhost:5000/users",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          id_user: user.id_user,
          role: user.role
        },

        body: JSON.stringify(form)
      }
    );

      setForm({
        nama_lengkap: "",
        email: "",
        password: "",
        role: "pengawas"
      });

      setOpen(false);

      fetchUsers();

    } catch (err) {

      console.log(err);
    }
  };

  // ================= EDIT USER =================
  const handleEdit = (u) => {

    setEditId(u.id_user);

    setForm({
      nama_lengkap:
        u.nama_lengkap,

      email:
        u.email,

      password: "",

      role:
        u.role
    });

    setOpen(true);
  };

  // ================= UPDATE USER =================
  const handleUpdate = async () => {

    // ================= VALIDATION =================
    if (
      !form.nama_lengkap ||
      !form.email
    ) {

      alert(
        "Semua field wajib diisi"
      );

      return;
    }

    // ================= EMAIL VALIDATION =================
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(form.email)
    ) {

      alert(
        "Format email tidak valid"
      );

      return;
    }

    try {

    await fetch(
      `http://localhost:5000/users/${editId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          id_user: user.id_user,
          role: user.role
        },

        body: JSON.stringify(form)
      }
    );

      setOpen(false);

      setEditId(null);

      setForm({
        nama_lengkap: "",
        email: "",
        password: "",
        role: "pengawas"
      });

      fetchUsers();

    } catch (err) {

      console.log(err);
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus user?"
      );

    if (!confirmDelete) return;

    try {

    await fetch(
      `http://localhost:5000/users/${id}`,
      {
        method: "DELETE",

        headers: {
          id_user: user.id_user,
          role: user.role
        }
      }
    );

      fetchUsers();

    } catch (err) {

      console.log(err);
    }
  };

  return (
    <MainLayout title="Kelola User">

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

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Manajemen User
          </Typography>

          <Button
            variant="contained"
            startIcon={
              <AddOutlinedIcon />
            }
            onClick={() => {

              setEditId(null);

              setForm({
                nama_lengkap: "",
                email: "",
                password: "",
                role: "pengawas",
              });

              setOpen(true);
            }}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold"
            }}
          >
            Tambah User
          </Button>

        </Box>

      </Box>

      {/* ================= LIST USER ================= */}
      <Card
        sx={{
          borderRadius: 3,
          p: 2,

          height: "calc(100vh - 220px)",

          overflowY: "auto"
        }}
      >

        {users.map((u) => (

          <Box key={u.id_user}>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={2}
            >

              {/* ================= INFO ================= */}
              <Box>

                <Typography fontWeight="bold">
                  {u.nama_lengkap}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {u.email}
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={1}
                >

                  <Chip
                    label={u.role}
                    size="small"
                    color="primary"
                  />

                </Box>

              </Box>

              {/* ================= ACTION ================= */}
              <Box>

                <IconButton
                  onClick={() =>
                    handleEdit(u)
                  }
                >
                  <EditOutlinedIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() =>
                    handleDelete(
                      u.id_user
                    )
                  }
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>

              </Box>

            </Box>

            <Divider />

          </Box>

        ))}

      </Card>

      {/* ================= DIALOG ================= */}
      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
      >

        <DialogTitle>

          {editId
            ? "Edit User"
            : "Tambah User"}

        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            label="Nama Lengkap"
            sx={{ mt: 2 }}
            value={form.nama_lengkap}
            onChange={(e) =>
              setForm({
                ...form,
                nama_lengkap:
                  e.target.value
              })
            }
          />

          <TextField
            fullWidth
            label="Email"
            sx={{ mt: 2 }}
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value
              })
            }
          />

          {!editId && (

            <TextField
              fullWidth
              label="Password"
              type="password"
              sx={{ mt: 2 }}
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value
                })
              }
            />

          )}

          <TextField
            select
            fullWidth
            label="Role"
            sx={{ mt: 2 }}
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role:
                  e.target.value
              })
            }
          >

            <MenuItem value="admin">
              Admin
            </MenuItem>

            <MenuItem value="pengawas">
              Pengawas
            </MenuItem>

            <MenuItem value="direktur">
              Direktur
            </MenuItem>

          </TextField>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Batal
          </Button>

          <Button
            variant="contained"
            onClick={
              editId
                ? handleUpdate
                : handleAdd
            }
          >
            {editId
              ? "Update"
              : "Simpan"}
          </Button>

        </DialogActions>

      </Dialog>

    </MainLayout>
  );
}