import db from "../config/db.js";
import bcrypt from "bcrypt";

// ================= GET ALL USER =================
export const getUsers = async (req, res) => {

  try {

    const sql = `
      SELECT 
        u.id_user,
        u.nama_lengkap,
        u.email,
        u.role,
        up.id_proyek,
        p.nama_proyek

      FROM users u

      LEFT JOIN user_proyek up
      ON u.id_user = up.id_user

      LEFT JOIN proyek p
      ON up.id_proyek = p.id_proyek

      ORDER BY u.id_user DESC
    `;

    const [rows] = await db.query(sql);

    res.json(rows);

  } catch (err) {

    console.error("ERROR GET USERS:", err);

    res.status(500).json({
      message: "Gagal mengambil data user"
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
      role,
      id_proyek
    } = req.body;

    // ================= HASH PASSWORD =================
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ================= INSERT USER =================
    const sql =
      "INSERT INTO users (nama_lengkap, email, password, role) VALUES (?, ?, ?, ?)";

    const [result] = await db.query(sql, [
      nama_lengkap,
      email,
      hashedPassword,
      role
    ]);

    // ================= INSERT USER_PROYEK =================
    if (
      role === "pengawas" &&
      id_proyek
    ) {

      await db.query(`
        INSERT INTO user_proyek
        (id_user, id_proyek)
        VALUES (?, ?)
      `, [
        result.insertId,
        id_proyek
      ]);
    }

    res.json({
      message: "User berhasil ditambahkan"
    });

  } catch (err) {

    console.error("ERROR CREATE USER:", err);

    res.status(500).json({
      message: "Gagal menambahkan user"
    });
  }
};

// ================= UPDATE USER =================
export const updateUser = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nama_lengkap,
      email,
      role,
      id_proyek
    } = req.body;

    // ================= UPDATE USER =================
    const sql =
      "UPDATE users SET nama_lengkap=?, email=?, role=? WHERE id_user=?";

    await db.query(sql, [
      nama_lengkap,
      email,
      role,
      id
    ]);

    // ================= DELETE RELASI LAMA =================
    await db.query(`
      DELETE FROM user_proyek
      WHERE id_user = ?
    `, [id]);

    // ================= INSERT RELASI BARU =================
    if (
      role === "pengawas" &&
      id_proyek
    ) {

      await db.query(`
        INSERT INTO user_proyek
        (id_user, id_proyek)
        VALUES (?, ?)
      `, [
        id,
        id_proyek
      ]);
    }

    res.json({
      message: "User berhasil diupdate"
    });

  } catch (err) {

    console.error("ERROR UPDATE USER:", err);

    res.status(500).json({
      message: "Gagal update user"
    });
  }
};

// ================= DELETE USER =================
export const deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    // ================= DELETE RELASI =================
    await db.query(`
      DELETE FROM user_proyek
      WHERE id_user = ?
    `, [id]);

    // ================= DELETE USER =================
    const sql =
      "DELETE FROM users WHERE id_user=?";

    await db.query(sql, [id]);

    res.json({
      message: "User berhasil dihapus"
    });

  } catch (err) {

    console.error("ERROR DELETE USER:", err);

    res.status(500).json({
      message: "Gagal hapus user"
    });
  }
};