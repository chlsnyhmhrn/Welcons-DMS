import express from "express";
import { getLogAktivitas } from "../controllers/log.controller.js";

const router = express.Router();

router.get("/", getLogAktivitas);

export default router;