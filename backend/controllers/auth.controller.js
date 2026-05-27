import db from "../config/db.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    console.log(
      "LOGIN REQUEST:",
      email
    );

    // ================= CEK EMAIL =================
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {

      return res.status(401).json({
        success: false,
        message:
          "Email tidak ditemukan",
      });
    }

    const user = rows[0];

    // ================= CEK PASSWORD HASH =================
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    return res.json({
      success: true,
      user: {
        id_user: user.id_user,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    console.error(
      "LOGIN ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};