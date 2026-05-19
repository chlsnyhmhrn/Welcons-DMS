import db from "../config/db.js";

// 🔥 helper format tanggal (FIX UTAMA)
const formatDate = (date) => {
  if (!date) return null;
  return date.split("T")[0]; // YYYY-MM-DD
};

// 🔥 GET semua proyek
export const getProyek = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM proyek ORDER BY id_proyek DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: "Gagal ambil data proyek" });
  }
};

// 🔥 POST tambah proyek
export const tambahProyek = async (req, res) => {
  try {
    const {
      kode_proyek,
      nama_proyek,
      lokasi,
      tanggal_mulai,
      status_proyek,
      deskripsi
    } = req.body;

    if (!kode_proyek || !nama_proyek) {
      return res.status(400).json({
        message: "Kode dan nama proyek wajib diisi"
      });
    }

    await db.query(
      `INSERT INTO proyek 
      (kode_proyek, nama_proyek, lokasi, tanggal_mulai, status_proyek, deskripsi) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        kode_proyek,
        nama_proyek,
        lokasi || null,
        formatDate(tanggal_mulai),
        status_proyek || null,
        deskripsi || null
      ]
    );

    res.json({ message: "Proyek berhasil ditambahkan" });

  } catch (error) {
    console.error("POST ERROR:", error);
    res.status(500).json({ message: "Gagal tambah proyek" });
  }
};

// 🔥 UPDATE proyek
export const updateProyek = async (req, res) => {
  try {
    const id = Number(req.params.id);

    console.log("UPDATE ID:", id);
    console.log("UPDATE BODY:", req.body);

    const {
      kode_proyek,
      nama_proyek,
      lokasi,
      tanggal_mulai,
      status_proyek,
      deskripsi
    } = req.body;

    const [result] = await db.query(
      `UPDATE proyek SET 
        kode_proyek=?,
        nama_proyek=?,
        lokasi=?,
        tanggal_mulai=?,
        status_proyek=?,
        deskripsi=?
      WHERE id_proyek=?`,
      [
        kode_proyek || null,
        nama_proyek || null,
        lokasi || null,
        formatDate(tanggal_mulai),
        status_proyek || null,
        deskripsi || null,
        id
      ]
    );

    console.log("UPDATE RESULT:", result);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Proyek tidak ditemukan atau data tidak berubah"
      });
    }

    res.json({ message: "Proyek berhasil diupdate" });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Gagal update proyek" });
  }
};

// 🔥 DELETE proyek (FIX TOTAL + DEBUG)
export const deleteProyek = async (req, res) => {
  try {
    const id = Number(req.params.id);

    console.log("DELETE ID:", id);

    const [result] = await db.query(
      "DELETE FROM proyek WHERE id_proyek = ?",
      [id]
    );

    console.log("DELETE RESULT:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Proyek tidak ditemukan"
      });
    }

    res.json({ message: "Proyek berhasil dihapus" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Gagal hapus proyek" });
  }
};