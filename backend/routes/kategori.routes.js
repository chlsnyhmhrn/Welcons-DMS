import express from "express";
import {
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori
} from "../controllers/kategori.controller.js";

const router = express.Router();

router.get("/", getKategori);
router.post("/", createKategori);
router.put("/:id", updateKategori);
router.delete("/:id", deleteKategori);

export default router;