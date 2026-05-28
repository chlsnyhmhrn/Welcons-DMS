import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import DetailMonitoring from "./pages/DetailMonitoring";
import Dokumen from "./pages/Dokumen";
import DetailDokumen from "./pages/DetailDokumen";
import LogAktivitas from "./pages/LogAktivitas";
import Notifikasi from "./pages/Notifikasi";
import Proyek from "./pages/Proyek";
import Kategori from "./pages/Kategori";
import Users from "./pages/Users";
import Login from "./pages/Login";
import UploadDokumen from "./pages/UploadDokumen";
import TambahProyek from "./pages/TambahProyek";
import EditProyek from "./pages/EditProyek";
import AssignProyek from "./pages/AssignProyek";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* ================= DASHBOARD ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= MONITORING ================= */}
      <Route
        path="/monitoring"
        element={
          <ProtectedRoute>
            <Monitoring />
          </ProtectedRoute>
        }
      />

      {/* 🔥 DETAIL MONITORING PROYEK */}
      <Route
        path="/monitoring/:namaProyek"
        element={
          <ProtectedRoute>
            <DetailMonitoring />
          </ProtectedRoute>
        }
      />

      {/* ================= DOKUMEN ================= */}
      <Route
        path="/dokumen"
        element={
          <ProtectedRoute>
            <Dokumen />
          </ProtectedRoute>
        }
      />

      <Route
        path="/detail-dokumen/:id"
        element={
          <ProtectedRoute>
            <DetailDokumen />
          </ProtectedRoute>
        }
      />

      {/* ================= UPLOAD ================= */}
      <Route
        path="/upload-dokumen"
        element={
          <ProtectedRoute>
            <UploadDokumen />
          </ProtectedRoute>
        }
      />

      {/* ================= LOG AKTIVITAS ================= */}
      <Route
        path="/log-aktivitas"
        element={
          <ProtectedRoute>
            <LogAktivitas />
          </ProtectedRoute>
        }
      />

      {/* ================= NOTIFIKASI ================= */}
      <Route
        path="/notifikasi"
        element={
          <ProtectedRoute>
            <Notifikasi />
          </ProtectedRoute>
        }
      />

      {/* ================= PROYEK ================= */}
      <Route
        path="/proyek"
        element={
          <ProtectedRoute>
            <Proyek />
          </ProtectedRoute>
        }
      />

      {/* ================= TAMBAH PROYEK ================= */}
      <Route
        path="/tambah-proyek"
        element={
          <ProtectedRoute>
            <TambahProyek />
          </ProtectedRoute>
        }
      />

      {/* ================= EDIT PROYEK ================= */}
      <Route
        path="/edit-proyek/:id"
        element={
          <ProtectedRoute>
            <EditProyek />
          </ProtectedRoute>
        }
      />

      {/*// ================= ASSIGN USER PROYEK =================*/}
      <Route
        path="/assign-proyek/:id"
        element={
          <ProtectedRoute>
            <AssignProyek />
          </ProtectedRoute>
        }
      />

      {/* ================= KATEGORI ================= */}
      <Route
        path="/kategori"
        element={
          <ProtectedRoute>
            <Kategori />
          </ProtectedRoute>
        }
      />

      {/* ================= USERS ================= */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      {/* ================= DEFAULT ================= */}
      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
    
  );
}