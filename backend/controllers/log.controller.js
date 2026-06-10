import db from "../config/db.js";

export const getLogAktivitas = async (req, res) => {

  try {

    let query = `
      SELECT
        l.*,
        u.nama_lengkap,
        d.nama_dokumen,
        p.nama_proyek,
        k.nama_kategori

      FROM log_aktivitas l

      LEFT JOIN users u
      ON l.id_user = u.id_user

      LEFT JOIN dokumen d
      ON l.id_dokumen = d.id_dokumen

      LEFT JOIN proyek p
      ON d.id_proyek = p.id_proyek

      LEFT JOIN kategori_dokumen k
      ON d.id_kategori = k.id_kategori
    `;

    let values = [];

    // ================= FILTER ROLE =================
    const role = req.headers.role;
    const id_user = req.headers.id_user;

    if (
      role === "pengawas"
    ) {

      query += `
        INNER JOIN user_proyek up
        ON d.id_proyek = up.id_proyek

        WHERE up.id_user = ?
      `;

      values.push(id_user);
    }

    // ================= ORDER =================
    query += `
      ORDER BY l.timestamp DESC
    `;

    const [rows] = await db.query(
      query,
      values
    );

    res.json(rows);

  } catch (err) {

    console.error("ERROR LOG:", err);

    res.status(500).json(err);
  }
};