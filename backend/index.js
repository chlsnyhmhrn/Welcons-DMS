import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import db from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import dokumenRoutes from "./routes/dokumen.routes.js";
import userRoutes from "./routes/user.routes.js";
import proyekRoutes from "./routes/proyek.routes.js";
import kategoriRoutes from "./routes/kategori.routes.js";
import logRoutes from "./routes/log.routes.js";

const app = express();

// ================= FIX __DIRNAME =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= STATIC FILE =================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ================= TEMP AUTH =================
app.use((req, res, next) => {

  const id_user =
    req.headers["id_user"];

  const role =
    req.headers["role"];

  // 🔥 fallback ambil dari local login sementara
  req.user = {
    id_user: id_user || 1,
    role: role || "admin"
  };

  next();
});

// ================= ROUTES =================
app.use("/", authRoutes);

app.use("/dokumen", dokumenRoutes);

app.use("/users", userRoutes);

app.use("/proyek", proyekRoutes);

app.use("/kategori", kategoriRoutes);

app.use("/log", logRoutes);


// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log(
    "Server running on http://localhost:5000"
  );
});