import db from "../config/db.js";
import { logActivity } from "../utils/logActivity.js";

// ================= GET SEMUA KATEGORI =================
export const getKategori = async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM kategori_dokumen ORDER BY id_kategori DESC"
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ================= TAMBAH KATEGORI =================
export const createKategori = async (req, res) => {

  try {

    const {
      nama_kategori,
      jenis_proyek,
      bidang,
      jenis_form,
      item_pekerjaan,
      is_tipikal
    } = req.body;

    // 🔥 VALIDASI
    if (
      !nama_kategori ||
      !jenis_proyek ||
      !bidang ||
      !jenis_form ||
      !item_pekerjaan
    ) {

      return res.status(400).json({
        message:
          "Semua field wajib diisi"
      });
    }

    // 🔥 INSERT DULU
    const [result] = await db.query(
      `INSERT INTO kategori_dokumen 
      (
        nama_kategori,
        jenis_proyek,
        bidang,
        jenis_form,
        item_pekerjaan,
        is_tipikal
      ) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nama_kategori,
        jenis_proyek,
        bidang,
        jenis_form,
        item_pekerjaan,

        is_tipikal ?? 0
      ]
    );

    const id =
      result.insertId;

    // 🔥 GENERATE KODE
    const kode =
      `KTG${String(id).padStart(3, "0")}`;

    await db.query(
      `UPDATE kategori_dokumen 
       SET kode_kategori = ?
       WHERE id_kategori = ?`,
      [kode, id]
    );

    await logActivity({
      id_user: req.user?.id_user,
      aktivitas: "Tambah Kategori",
      keterangan: `Menambahkan kategori ${nama_kategori}`
    });

    // 🔥 AMBIL DATA BARU
    const [newData] = await db.query(
      `SELECT * FROM kategori_dokumen
       WHERE id_kategori = ?`,
      [id]
    );

    res.status(201).json({
      message:
        "Kategori berhasil ditambahkan",

      data:
        newData[0]
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });
  }
};

// ================= UPDATE KATEGORI =================
export const updateKategori = async (req, res) => {

  try {

    const { id } =
      req.params;

    const {
      nama_kategori,
      jenis_proyek,
      bidang,
      jenis_form,
      item_pekerjaan,
      is_tipikal,
      is_active
    } = req.body;

    // 🔥 VALIDASI
    if (
      !nama_kategori ||
      !jenis_proyek ||
      !bidang ||
      !jenis_form ||
      !item_pekerjaan
    ) {

      return res.status(400).json({
        message:
          "Semua field wajib diisi"
      });
    }

    // 🔥 CEK DATA
    const [cek] = await db.query(
      `SELECT * FROM kategori_dokumen
       WHERE id_kategori = ?`,
      [id]
    );

    if (cek.length === 0) {

      return res.status(404).json({
        message:
          "Kategori tidak ditemukan"
      });
    }
    const oldKategori = cek[0];

    // 🔥 UPDATE
    await db.query(
      `UPDATE kategori_dokumen 
       SET 
         nama_kategori = ?,
         jenis_proyek = ?,
         bidang = ?,
         jenis_form = ?,
         item_pekerjaan = ?,
         is_tipikal = ?,
         is_active = ?
       WHERE id_kategori = ?`,
      [
        nama_kategori,
        jenis_proyek,
        bidang,
        jenis_form,
        item_pekerjaan,

        is_tipikal ?? 0,

        is_active ?? 1,

        id
      ]
    );

    await logActivity({
      id_user: req.user?.id_user,
      aktivitas: "Update Kategori",
      keterangan: `Mengubah kategori ${oldKategori.nama_kategori}`
    }); 

    res.json({
      message:
        "Kategori berhasil diupdate"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });
  }
};

// ================= DELETE KATEGORI =================
export const deleteKategori = async (req, res) => {

  try {

    const { id } =
      req.params;

    // 🔥 CEK DATA
    const [cek] = await db.query(
      `SELECT * FROM kategori_dokumen
       WHERE id_kategori = ?`,
      [id]
    );

    if (cek.length === 0) {

      return res.status(404).json({
        message:
          "Kategori tidak ditemukan"
      });
    }
    const kategori = cek[0];

    // 🔥 DELETE
    await db.query(
      `DELETE FROM kategori_dokumen
       WHERE id_kategori = ?`,
      [id]
    );

    await logActivity({
      id_user: req.user?.id_user,
      aktivitas: "Hapus Kategori",
      keterangan: `Menghapus kategori ${kategori.nama_kategori}`
    });

    res.json({
      message:
        "Kategori berhasil dihapus"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });
  }
};