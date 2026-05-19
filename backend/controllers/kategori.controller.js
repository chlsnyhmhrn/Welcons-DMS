import db from "../config/db.js";

// GET semua kategori
export const getKategori = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM kategori_dokumen ORDER BY id_kategori DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST tambah kategori (AUTO KODE)
export const createKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;

    // validasi
    if (!nama_kategori) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    // 1. insert dulu
    const [result] = await db.query(
      "INSERT INTO kategori_dokumen (nama_kategori) VALUES (?)",
      [nama_kategori]
    );

    const id = result.insertId;

    // 2. generate kode otomatis
    const kode = `KTG${String(id).padStart(3, "0")}`;

    await db.query(
      "UPDATE kategori_dokumen SET kode_kategori = ? WHERE id_kategori = ?",
      [kode, id]
    );

    // 3. ambil data yg baru dibuat
    const [newData] = await db.query(
      "SELECT * FROM kategori_dokumen WHERE id_kategori = ?",
      [id]
    );

    res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      data: newData[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE kategori
export const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori, is_active } = req.body;

    // validasi
    if (!nama_kategori) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    // cek data ada atau tidak
    const [cek] = await db.query(
      "SELECT * FROM kategori_dokumen WHERE id_kategori = ?",
      [id]
    );

    if (cek.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // update
    await db.query(
      `UPDATE kategori_dokumen 
       SET nama_kategori = ?, is_active = ?
       WHERE id_kategori = ?`,
      [
        nama_kategori,
        is_active ?? 1,
        id
      ]
    );

    res.json({ message: "Kategori berhasil diupdate" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE kategori
export const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    // cek dulu ada atau tidak
    const [cek] = await db.query(
      "SELECT * FROM kategori_dokumen WHERE id_kategori = ?",
      [id]
    );

    if (cek.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    await db.query(
      "DELETE FROM kategori_dokumen WHERE id_kategori = ?",
      [id]
    );

    res.json({ message: "Kategori berhasil dihapus" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};