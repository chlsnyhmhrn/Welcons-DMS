import express from "express";
import multer from "multer";

import {
  getAllDokumen,
  getDetailDokumen,
  uploadDokumen,
  updateDokumen,
  deleteDokumen,
  updateStatus,
  getRiwayatDokumen
} from "../controllers/dokumen.controller.js";

const router = express.Router();

// ================= CONFIG UPLOAD =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ================= ROUTES =================

// 🔥 GET ALL (versi terbaru)
router.get("/", getAllDokumen);

// 🔥 RIWAYAT (WAJIB di atas /:id)
router.get("/riwayat/:id", getRiwayatDokumen);

// 🔥 DETAIL DOKUMEN
router.get("/:id", getDetailDokumen);

// 🔥 UPLOAD DOKUMEN (AUTO VERSIONING)
router.post("/upload", upload.single("file"), uploadDokumen);

// 🔥 UPDATE DATA
router.put("/:id", updateDokumen);

// 🔥 DELETE (hapus semua versi)
router.delete("/:id", deleteDokumen);

// 🔥 UPDATE STATUS (per versi)
router.put("/status/:id", updateStatus);

export default router;