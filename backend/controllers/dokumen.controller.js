import db from "../config/db.js";
import { logActivity } from "../utils/logActivity.js";
import crypto from "crypto";
import fs from "fs";

// ================= GET ALL DOKUMEN =================
export const getAllDokumen = async (req, res) => {
  try {

    let query = `
      SELECT 
        d.*,
        p.nama_proyek,
        p.lokasi,
        p.status_proyek,
        k.nama_kategori
      FROM dokumen d

      LEFT JOIN proyek p
      ON d.id_proyek = p.id_proyek

      LEFT JOIN kategori_dokumen k
      ON d.id_kategori = k.id_kategori
    `;

    let values = [];

    // 🔥 FILTER KHUSUS PENGAWAS
    if (req.user?.role === "pengawas") {

      query += `
        INNER JOIN user_proyek up
        ON d.id_proyek = up.id_proyek

        WHERE up.id_user = ?
        AND d.is_deleted = 0
      `;

      values.push(req.user.id_user);

    } else {

      query += `
        WHERE d.is_deleted = 0
      `;
    }

    query += `
      ORDER BY d.created_at DESC
    `;

    const [rows] = await db.query(
      query,
      values
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json(err);
  }
};

// ================= DETAIL DOKUMEN =================
export const getDetailDokumen = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT 
        d.*,
        p.nama_proyek,
        p.lokasi,
        p.status_proyek,
        k.nama_kategori
      FROM dokumen d

      LEFT JOIN proyek p
      ON d.id_proyek = p.id_proyek

      LEFT JOIN kategori_dokumen k
      ON d.id_kategori = k.id_kategori

      WHERE d.id_dokumen = ?
      AND d.is_deleted = 0
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Dokumen tidak ditemukan"
      });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ================= UPLOAD DOKUMEN =================
export const uploadDokumen = async (req, res) => {
  try {

    const {
      nama_dokumen,
      id_proyek,
      id_kategori,
      item_pekerjaan,
      status
    } = req.body;

    const file = req.file?.filename;

    if (!file) {
      return res.status(400).json({
        message: "File wajib diupload"
      });
    }

    if (
      !nama_dokumen ||
      !id_proyek ||
      !id_kategori ||
      !item_pekerjaan
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi"
      });
    }

    // ================= HASH FILE =================
    const fileBuffer = fs.readFileSync(`uploads/${file}`);

    const hashFile = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    // ================= CEK DUPLIKAT FILE =================
    const [duplicate] = await db.query(`
      SELECT *
      FROM dokumen
      WHERE hash_file = ?
      AND item_pekerjaan = ?
      AND is_deleted = 0
    `, [
      hashFile,
      item_pekerjaan
    ]);

    if (duplicate.length > 0) {
      return res.status(400).json({
        message:
          "Dokumen duplicate terdeteksi pada pekerjaan yang sama"
      });
    }

    // ================= CEK DOKUMEN EXIST =================
    const [exist] = await db.query(`
      SELECT *
      FROM dokumen
      WHERE nama_dokumen = ?
      AND item_pekerjaan = ?
      AND is_deleted = 0
      ORDER BY versi DESC
      LIMIT 1
    `, [
      nama_dokumen,
      item_pekerjaan
    ]);

    // ================= VERSI PERTAMA =================
    if (exist.length === 0) {

      const [result] = await db.query(`
        INSERT INTO dokumen
        (
          nama_dokumen,
          id_proyek,
          id_kategori,
          item_pekerjaan,
          nama_file,
          status,
          versi,
          hash_file
        )
        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
      `, [
        nama_dokumen,
        id_proyek,
        id_kategori,
        item_pekerjaan,
        file,
        status || "Perlu Revisi",
        hashFile
      ]);

      // parent_id = dirinya sendiri
      await db.query(
        "UPDATE dokumen SET parent_id = ? WHERE id_dokumen = ?",
        [result.insertId, result.insertId]
      );

      await logActivity({
        id_user: req.user?.id_user || null,
        id_dokumen: result.insertId,
        aktivitas: "Upload Dokumen",
        status_baru: status || "Perlu Revisi",
        keterangan: "Upload dokumen versi 1"
      });

      return res.json({
        message: "Upload berhasil (v1)"
      });
    }

    // ================= TAMBAH VERSI =================
    const lastDoc = exist[0];

    if (lastDoc.status === "Final") {
      return res.status(400).json({
        message:
          "Dokumen sudah Final, tidak bisa upload versi baru"
      });
    }

    const newVersi = lastDoc.versi + 1;

    const [result] = await db.query(`
      INSERT INTO dokumen
      (
        nama_dokumen,
        id_proyek,
        id_kategori,
        item_pekerjaan,
        nama_file,
        status,
        versi,
        parent_id,
        hash_file
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nama_dokumen,
      id_proyek,
      id_kategori,
      item_pekerjaan,
      file,
      status || "Perlu Revisi",
      newVersi,
      lastDoc.parent_id,
      hashFile
    ]);

    // versi lama obsolete
    await db.query(`
      UPDATE dokumen
      SET status = 'Obsolete'
      WHERE id_dokumen = ?
    `, [lastDoc.id_dokumen]);

    await logActivity({
      id_user: req.user?.id_user || null,
      id_dokumen: result.insertId,
      aktivitas: "Upload Versi Baru",
      status_lama: lastDoc.status,
      status_baru: status || "Perlu Revisi",
      keterangan: `Upload versi ${newVersi}`
    });

    res.json({
      message: `Upload berhasil (v${newVersi})`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ================= RIWAYAT DOKUMEN =================
export const getRiwayatDokumen = async (req, res) => {
  try {

    const { id } = req.params;

    const [doc] = await db.query(`
      SELECT parent_id
      FROM dokumen
      WHERE id_dokumen = ?
    `, [id]);

    if (doc.length === 0) {
      return res.status(404).json({
        message: "Dokumen tidak ditemukan"
      });
    }

    const [rows] = await db.query(`
      SELECT *
      FROM dokumen
      WHERE parent_id = ?
      AND is_deleted = 0
      ORDER BY versi DESC
    `, [doc[0].parent_id]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ================= UPDATE DOKUMEN =================
export const updateDokumen = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      nama_dokumen,
      status
    } = req.body;

    // ================= GET DATA LAMA =================
    const [doc] = await db.query(`
      SELECT *
      FROM dokumen
      WHERE id_dokumen = ?
    `, [id]);

    if (doc.length === 0) {
      return res.status(404).json({
        message: "Dokumen tidak ditemukan"
      });
    }

    const current = doc[0];

    // ================= UPDATE DATA =================
    await db.query(`
      UPDATE dokumen
      SET
      nama_dokumen = ?,
      status = ?
      WHERE id_dokumen = ?
    `, [
      nama_dokumen,
      status,
      id
    ]);

    // ================= LOG NAMA DOKUMEN =================
    if (
      current.nama_dokumen !==
      nama_dokumen
    ) {

      await logActivity({
        id_user:
          req.user?.id_user || null,

        id_dokumen: id,

        aktivitas:
          "Update Nama Dokumen",

        keterangan:
          `Nama dokumen diubah dari "${current.nama_dokumen}" menjadi "${nama_dokumen}"`
      });
    }

    // ================= LOG STATUS =================
    if (
      current.status !== status
    ) {

      await logActivity({
        id_user:
          req.user?.id_user || null,

        id_dokumen: id,

        aktivitas:
          "Update Status",

        status_lama:
          current.status,

        status_baru:
          status,

        keterangan:
          `Status diubah dari "${current.status}" menjadi "${status}"`
      });
    }

    res.json({
      message:
        "Dokumen berhasil diupdate"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json(err);
  }
};

// ================= DELETE DOKUMEN =================
export const deleteDokumen = async (req, res) => {
  try {

    const { id } = req.params;

    const [doc] = await db.query(`
      SELECT parent_id
      FROM dokumen
      WHERE id_dokumen = ?
    `, [id]);

    if (doc.length === 0) {
      return res.status(404).json({
        message: "Dokumen tidak ditemukan"
      });
    }

    await db.query(`
      UPDATE dokumen
      SET is_deleted = 1
      WHERE parent_id = ?
    `, [doc[0].parent_id]);

    await logActivity({
      id_user: req.user?.id_user || null,
      id_dokumen: id,
      aktivitas: "Hapus Dokumen",
      keterangan: "Menghapus semua versi dokumen"
    });

    res.json({
      message: "Dokumen berhasil dihapus"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ================= UPDATE STATUS =================
export const updateStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const [doc] = await db.query(`
      SELECT *
      FROM dokumen
      WHERE id_dokumen = ?
    `, [id]);

    if (doc.length === 0) {
      return res.status(404).json({
        message: "Dokumen tidak ditemukan"
      });
    }

    const current = doc[0];

    if (status === "Final") {

      await db.query(`
        UPDATE dokumen
        SET status = 'Obsolete'
        WHERE parent_id = ?
        AND id_dokumen != ?
      `, [
        current.parent_id,
        id
      ]);
    }

    await db.query(`
      UPDATE dokumen
      SET status = ?
      WHERE id_dokumen = ?
    `, [
      status,
      id
    ]);

    await logActivity({
      id_user: req.user?.id_user || null,
      id_dokumen: id,
      aktivitas: "Update Status",
      status_lama: current.status,
      status_baru: status,
      keterangan: "Perubahan status dokumen"
    });

    res.json({
      message: "Status berhasil diupdate"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};