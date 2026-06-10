import db from "../config/db.js";
import bcrypt from "bcrypt";
import { logActivity } from "../utils/logActivity.js";

// ================= GET ALL USER =================
export const getUsers = async (req, res) => {

  try {

    const sql = `
      SELECT
        id_user,
        nama_lengkap,
        email,
        role
      FROM users
      ORDER BY id_user DESC
    `;

    const [rows] = await db.query(sql);

    res.json(rows);

  } catch (err) {

    console.error(
      "ERROR GET USERS:",
      err
    );

    res.status(500).json({
      message:
        "Gagal mengambil data user"
    });
  }
};

// ================= CREATE USER =================
export const createUser = async (req, res) => {

  try {

    const {
      nama_lengkap,
      email,
      password,
      role
    } = req.body;

    // ================= HASH PASSWORD =================
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ================= INSERT USER =================
    const sql = `
      INSERT INTO users
      (
        nama_lengkap,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?)
    `;

    await db.query(sql, [
      nama_lengkap,
      email,
      hashedPassword,
      role
    ]);

    // ================= LOG =================
    await logActivity({
      id_user: req.user?.id_user,
      aktivitas: "Tambah User",
      keterangan: `Menambahkan user ${nama_lengkap} (${role})`
    });

    res.json({
      message:
        "User berhasil ditambahkan"
    });

  } catch (err) {

    console.error(
      "ERROR CREATE USER:",
      err
    );

    res.status(500).json({
      message:
        "Gagal menambahkan user"
    });
  }
};

// ================= UPDATE USER =================
export const updateUser = async (req, res) => {

  try {

    const { id } =
      req.params;

    const {
      nama_lengkap,
      email,
      role
    } = req.body;

    // ================= DATA LAMA =================
    const [oldUser] = await db.query(
      "SELECT * FROM users WHERE id_user = ?",
      [id]
    );

    // ================= UPDATE USER =================
    const sql = `
      UPDATE users
      SET
        nama_lengkap = ?,
        email = ?,
        role = ?
      WHERE id_user = ?
    `;

    await db.query(sql, [
      nama_lengkap,
      email,
      role,
      id
    ]);

    // ================= LOG =================
    await logActivity({
      id_user: req.user?.id_user,
      aktivitas: "Update User",
      keterangan:
        `Mengubah data user ${oldUser[0].nama_lengkap}`
    });

    res.json({
      message:
        "User berhasil diupdate"
    });

  } catch (err) {

    console.error(
      "ERROR UPDATE USER:",
      err
    );

    res.status(500).json({
      message:
        "Gagal update user"
    });
  }
};

// ================= DELETE USER =================
export const deleteUser = async (req, res) => {

  try {

    const { id } =
      req.params;

    // ================= AMBIL DATA USER =================
    const [user] = await db.query(
      "SELECT * FROM users WHERE id_user = ?",
      [id]
    );

    // ================= DELETE RELASI USER PROYEK =================
    await db.query(
      `
      DELETE FROM user_proyek
      WHERE id_user = ?
      `,
      [id]
    );

    // ================= DELETE USER =================
    await db.query(
      `
      DELETE FROM users
      WHERE id_user = ?
      `,
      [id]
    );

    // ================= LOG =================
    await logActivity({
      id_user: req.user?.id_user,
      aktivitas: "Hapus User",
      keterangan:
        `Menghapus user ${user[0].nama_lengkap}`
    });

    res.json({
      message:
        "User berhasil dihapus"
    });

  } catch (err) {

    console.error(
      "ERROR DELETE USER:",
      err
    );

    res.status(500).json({
      message:
        "Gagal hapus user"
    });
  }
};