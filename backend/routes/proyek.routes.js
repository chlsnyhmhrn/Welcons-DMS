import express from "express";
const router = express.Router();

import {
  getProyek,
  tambahProyek,
  updateProyek,
  deleteProyek
} from "../controllers/proyek.controller.js";

// 🔥 GET semua proyek
router.get("/", getProyek);

// 🔥 POST tambah proyek
router.post("/", tambahProyek);

// 🔥 UPDATE proyek
router.put("/:id", updateProyek);

// 🔥 DELETE proyek (PAKAI CONTROLLER)
router.delete("/:id", deleteProyek);

export default router;