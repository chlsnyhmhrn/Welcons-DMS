import express from "express";
const router = express.Router();

import {
  getProyek,
  tambahProyek,
  updateProyek,
  deleteProyek,

  // 🔥 ASSIGN USER
  getAssignProyek,
  saveAssignProyek

} from "../controllers/proyek.controller.js";

// 🔥 GET semua proyek
router.get("/", getProyek);

// 🔥 POST tambah proyek
router.post("/", tambahProyek);

// 🔥 UPDATE proyek
router.put("/:id", updateProyek);

// 🔥 DELETE proyek (PAKAI CONTROLLER)
router.delete("/:id", deleteProyek);

// 🔥 GET ASSIGN USER PROYEK
router.get("/:id/users", getAssignProyek);

// 🔥 SIMPAN ASSIGN USER PROYEK
router.post("/:id/users", saveAssignProyek);

export default router;