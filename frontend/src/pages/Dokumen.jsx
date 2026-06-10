import { useState, useEffect, useMemo } from "react";
import MainLayout from "../layout/MainLayout";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Paper
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dokumen() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterProyek, setFilterProyek] = useState("Semua");

  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // ================= EDIT =================
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState(null);

  const [editNama, setEditNama] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // ================= FETCH =================
  const fetchData = async () => {
    try {

      const res = await axios.get("http://localhost:5000/dokumen");

      setDocuments(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= ROLE =================
  if (!user || user.role !== "admin") {
    return (
      <MainLayout title="Kelola Dokumen">
        <Typography>Anda tidak memiliki akses</Typography>
      </MainLayout>
    );
  }

  // ================= LATEST VERSION =================
  const latestDocs = useMemo(() => {

    const map = new Map();

    documents.forEach((doc) => {

      const key = doc.parent_id || doc.id_dokumen;

      if (!map.has(key) || map.get(key).versi < doc.versi) {
        map.set(key, doc);
      }
    });

    return Array.from(map.values());

  }, [documents]);

  // ================= KATEGORI =================
  const kategoriOptions = useMemo(() => {

    const set = new Set();

    documents.forEach((d) => {
      if (d.nama_kategori) set.add(d.nama_kategori);
    });

    return ["Semua", ...Array.from(set)];

  }, [documents]);

  // ================= PROYEK =================
  const proyekOptions = useMemo(() => {

    const set = new Set();

    documents.forEach((d) => {
      if (d.nama_proyek) set.add(d.nama_proyek);
    });

    return ["Semua", ...Array.from(set)];

  }, [documents]);

  // ================= FILTER + SORT =================
  const filteredDocs = useMemo(() => {

    let data = latestDocs.filter((doc) => {

      const statusMatch =
        filterStatus === "Semua" ||
        doc.status === filterStatus;

      const kategoriMatch =
        filterKategori === "Semua" ||
        doc.nama_kategori === filterKategori;

      const proyekMatch =
        filterProyek === "Semua" ||
        doc.nama_proyek === filterProyek;

      return statusMatch && kategoriMatch && proyekMatch;
    });

    data.sort((a, b) => {

      let valA = a[sortField] || "";
      let valB = b[sortField] || "";

      if (sortField === "created_at") {

        return sortOrder === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    return data;

  }, [
    latestDocs,
    filterStatus,
    filterKategori,
    filterProyek,
    sortField,
    sortOrder
  ]);

  // ================= SORT =================
  const handleSort = (field) => {

    if (sortField === field) {

      setSortOrder(sortOrder === "asc" ? "desc" : "asc");

    } else {

      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getIcon = (field) => {

    if (sortField !== field) return null;

    return sortOrder === "asc"
      ? <ArrowUpwardIcon fontSize="small" />
      : <ArrowDownwardIcon fontSize="small" />;
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {

    switch (status) {

      case "Final":
        return "success";

      case "Perlu Revisi":
        return "warning";

      case "Obsolete":
        return "error";

      case "Draft":
        return "default";

      default:
        return "default";
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!window.confirm("Yakin hapus dokumen ini?")) return;

    try {

    await axios.delete(
      `http://localhost:5000/dokumen/${id}`,
      {
        headers: {
          id_user: user.id_user,
          role: user.role
        }
      }
    );

      fetchData();

    } catch {

      alert("Gagal hapus dokumen");
    }
  };

  // ================= OPEN EDIT =================
  const handleOpenEdit = (doc) => {

    setSelectedDoc(doc);

    setEditNama(doc.nama_dokumen);
    setEditStatus(doc.status);

    setOpenEdit(true);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {

    // ================= VALIDASI =================
    if (!editNama.trim()) {

      alert(
        "Nama dokumen wajib diisi"
      );

      return;
    }

    if (!editStatus) {

      alert(
        "Status dokumen wajib dipilih"
      );

      return;
    }

    try {

    await axios.put(
      `http://localhost:5000/dokumen/${selectedDoc.id_dokumen}`,
      {
        nama_dokumen: editNama,
        status: editStatus
      },
      {
        headers: {
          id_user: user.id_user,
          role: user.role
        }
      }
    );

      setOpenEdit(false);

      fetchData();

    } catch (err) {

      console.error(err);

      alert("Gagal update dokumen");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = (file) => {

    // ================= VALIDASI FILE =================
    if (!file) {

      alert(
        "File dokumen tidak tersedia"
      );

      return;
    }

    window.open(
      `http://localhost:5000/uploads/${file}`,
      "_blank"
    );
  };

  // ================= DETAIL =================
  const handleView = (id) => {

    if (!id) {

      alert(
        "Detail dokumen tidak ditemukan"
      );

      return;
    }

    navigate(`/detail-dokumen/${id}`);
  };

  // ================= UI =================
  return (
    <MainLayout title="Manajemen Dokumen">

{/* ================= STICKY TOP ================= */}
<Box
  sx={{
    position: "sticky",
    top: 10,
    zIndex: 100,
    bgcolor: "#F4F6F8",
    pb: 2
  }}
>

  {/* ================= HEADER ================= */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={3}
  >

    <Button
      variant="contained"
      startIcon={<AddOutlinedIcon />}
      onClick={() => navigate("/upload-dokumen")}
      sx={{
        borderRadius: 3,
        textTransform: "none",
        fontWeight: "bold"
      }}
    >
      Upload Dokumen
    </Button>

  </Box>

  {/* ================= FILTER ================= */}
  <Paper
    sx={{
      p: 2,
      borderRadius: 3
    }}
  >

    <Stack direction="row" spacing={2}>

      <TextField
        select
        size="small"
        label="Filter Status"
        value={filterStatus}
        onChange={(e) =>
          setFilterStatus(e.target.value)
        }
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="Semua">Semua</MenuItem>
        <MenuItem value="Draft">Draft</MenuItem>
        <MenuItem value="Perlu Revisi">
          Perlu Revisi
        </MenuItem>
        <MenuItem value="Final">Final</MenuItem>
        <MenuItem value="Obsolete">
          Obsolete
        </MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        label="Filter Kategori"
        value={filterKategori}
        onChange={(e) =>
          setFilterKategori(e.target.value)
        }
        sx={{ minWidth: 180 }}
      >
        {kategoriOptions.map((k) => (
          <MenuItem key={k} value={k}>
            {k}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Filter Proyek"
        value={filterProyek}
        onChange={(e) =>
          setFilterProyek(e.target.value)
        }
        sx={{ minWidth: 180 }}
      >
        {proyekOptions.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </TextField>

    </Stack>

  </Paper>

</Box>

{/* ================= TABLE ================= */}
<Paper
  sx={{
    borderRadius: 3,
    overflow: "hidden",
    height: "calc(100vh - 320px)",
    display: "flex",
    flexDirection: "column"
  }}
>

  <Box
    sx={{
      overflowY: "auto",
      flex: 1
    }}
  >

    <Table stickyHeader>

      <TableHead>

        <TableRow>

          <TableCell
            onClick={() => handleSort("nama_dokumen")}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              bgcolor: "white"
            }}
          >
            Nama Dokumen {getIcon("nama_dokumen")}
          </TableCell>

          <TableCell
            onClick={() => handleSort("nama_proyek")}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              bgcolor: "white"
            }}
          >
            Proyek {getIcon("nama_proyek")}
          </TableCell>

          <TableCell
            sx={{
              fontWeight: "bold",
              bgcolor: "white"
            }}
          >
            Kategori
          </TableCell>

          <TableCell
            sx={{
              fontWeight: "bold",
              bgcolor: "white"
            }}
          >
            Status
          </TableCell>

          <TableCell
            sx={{
              fontWeight: "bold",
              bgcolor: "white"
            }}
          >
            Versi
          </TableCell>

          <TableCell
            onClick={() => handleSort("created_at")}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              bgcolor: "white"
            }}
          >
            Tanggal {getIcon("created_at")}
          </TableCell>

          <TableCell
            sx={{
              fontWeight: "bold",
              bgcolor: "white"
            }}
          >
            Aksi
          </TableCell>

        </TableRow>

      </TableHead>

      <TableBody>

        {filteredDocs.map((doc) => (

          <TableRow
            key={doc.id_dokumen}
            hover
          >

            {/* NAMA */}
            <TableCell>

              <Typography fontWeight="bold">
                {doc.nama_dokumen}
              </Typography>

            </TableCell>

            {/* PROYEK */}
            <TableCell>
              {doc.nama_proyek}
            </TableCell>

            {/* KATEGORI */}
            <TableCell>
              {doc.nama_kategori}
            </TableCell>

            {/* STATUS */}
            <TableCell>

              <Chip
                label={doc.status}
                color={getStatusColor(doc.status)}
                size="small"
              />

            </TableCell>

            {/* VERSI */}
            <TableCell>

              <Chip
                label={`v${doc.versi}`}
                variant="outlined"
                size="small"
              />

            </TableCell>

            {/* TANGGAL */}
            <TableCell>
              {new Date(doc.created_at).toLocaleString()}
            </TableCell>

            {/* AKSI */}
            <TableCell>

              <Stack
                direction="row"
                spacing={1}
              >

                {/* DETAIL */}
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleView(doc.id_dokumen)
                  }
                >
                  <VisibilityOutlinedIcon />
                </IconButton>

                {/* DOWNLOAD */}
                <IconButton
                  color="success"
                  onClick={() =>
                    handleDownload(doc.nama_file)
                  }
                >
                  <DownloadOutlinedIcon />
                </IconButton>

                {/* EDIT */}
                <IconButton
                  color="warning"
                  onClick={() =>
                    handleOpenEdit(doc)
                  }
                >
                  <EditOutlinedIcon />
                </IconButton>

                {/* DELETE */}
                <IconButton
                  color="error"
                  onClick={() =>
                    handleDelete(doc.id_dokumen)
                  }
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>

              </Stack>

            </TableCell>

          </TableRow>

        ))}

      </TableBody>

    </Table>

  </Box>

</Paper>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Edit Dokumen
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            label="Nama Dokumen"
            value={editNama}
            onChange={(e) =>
              setEditNama(e.target.value)
            }
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Status Dokumen"
            value={editStatus}
            onChange={(e) =>
              setEditStatus(e.target.value)
            }
          >
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Perlu Revisi">
              Perlu Revisi
            </MenuItem>
            <MenuItem value="Final">Final</MenuItem>
            <MenuItem value="Obsolete">
              Obsolete
            </MenuItem>
          </TextField>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpenEdit(false)}
          >
            Batal
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
          >
            Simpan
          </Button>

        </DialogActions>

      </Dialog>

    </MainLayout>
  );
}