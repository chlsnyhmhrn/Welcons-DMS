import db from "../config/db.js";
import bcrypt from "bcrypt";

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