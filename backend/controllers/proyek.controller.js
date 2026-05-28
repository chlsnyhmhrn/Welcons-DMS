import db from "../config/db.js";

// 🔥 HELPER FORMAT TANGGAL
const formatDate = (date) => {

  if (!date) return null;

  return date.split("T")[0];
};

// ================= GET SEMUA PROYEK =================
export const getProyek = async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM proyek ORDER BY id_proyek DESC"
    );

    // 🔥 FORMAT JSON BIDANG PENGAWASAN
    const formattedRows =
      rows.map((item) => ({

        ...item,

        bidang_pengawasan:
          item.bidang_pengawasan

            ? JSON.parse(
                item.bidang_pengawasan
              )

            : []
      }));

    res.json(formattedRows);

  } catch (error) {

    console.error(
      "GET ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal ambil data proyek"
    });
  }
};

// ================= TAMBAH PROYEK =================
export const tambahProyek = async (req, res) => {

  try {

    const {
      nama_proyek,
      lokasi,
      tanggal_mulai,
      status_proyek,
      deskripsi,

      jenis_proyek,
      jumlah_lantai,
      bidang_pengawasan

    } = req.body;

    // 🔥 VALIDASI
    if (!nama_proyek) {

      return res.status(400).json({
        message:
          "Nama proyek wajib diisi"
      });
    }

    // 🔥 AMBIL ID TERAKHIR
    const [lastData] = await db.query(
      `SELECT id_proyek
       FROM proyek
       ORDER BY id_proyek DESC
       LIMIT 1`
    );

    // 🔥 GENERATE KODE PROYEK
    const lastId =
      lastData.length > 0

        ? lastData[0].id_proyek + 1

        : 1;

    const kodeProyek =
      `PRJ-${String(lastId).padStart(3, "0")}`;

    // 🔥 INSERT
    await db.query(
      `INSERT INTO proyek 
      (
        kode_proyek,
        nama_proyek,
        lokasi,
        tanggal_mulai,
        status_proyek,
        deskripsi,
        jenis_proyek,
        jumlah_lantai,
        bidang_pengawasan
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        kodeProyek,

        nama_proyek,

        lokasi || null,

        formatDate(
          tanggal_mulai
        ),

        status_proyek || null,

        deskripsi || null,

        jenis_proyek || null,

        jumlah_lantai || null,

        JSON.stringify(
          bidang_pengawasan || []
        )
      ]
    );

    res.json({
      message:
        "Proyek berhasil ditambahkan"
    });

  } catch (error) {

    console.error(
      "POST ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal tambah proyek"
    });
  }
};

// ================= UPDATE PROYEK =================
export const updateProyek = async (req, res) => {

  try {

    const id =
      Number(req.params.id);

    console.log(
      "UPDATE ID:",
      id
    );

    console.log(
      "UPDATE BODY:",
      req.body
    );

    const {
      kode_proyek,
      nama_proyek,
      lokasi,
      tanggal_mulai,
      status_proyek,
      deskripsi,

      jenis_proyek,
      jumlah_lantai,
      bidang_pengawasan

    } = req.body;

    const [result] = await db.query(
      `UPDATE proyek SET 
        kode_proyek=?,
        nama_proyek=?,
        lokasi=?,
        tanggal_mulai=?,
        status_proyek=?,
        deskripsi=?,

        jenis_proyek=?,
        jumlah_lantai=?,
        bidang_pengawasan=?

      WHERE id_proyek=?`,
      [
        kode_proyek || null,

        nama_proyek || null,

        lokasi || null,

        formatDate(
          tanggal_mulai
        ),

        status_proyek || null,

        deskripsi || null,

        jenis_proyek || null,

        jumlah_lantai || null,

        JSON.stringify(
          bidang_pengawasan || []
        ),

        id
      ]
    );

    console.log(
      "UPDATE RESULT:",
      result
    );

    if (
      result.affectedRows === 0
    ) {

      return res.status(400).json({
        message:
          "Proyek tidak ditemukan atau data tidak berubah"
      });
    }

    res.json({
      message:
        "Proyek berhasil diupdate"
    });

  } catch (error) {

    console.error(
      "UPDATE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal update proyek"
    });
  }
};

// ================= GET ASSIGN USER PROYEK =================
export const getAssignProyek = async (req, res) => {

  try {

    const { id } = req.params;

    // 🔥 SEMUA USER
    const [users] = await db.query(`
      SELECT
        id_user,
        nama_lengkap,
        role
      FROM users
      ORDER BY nama_lengkap ASC
    `);

  // 🔥 USER YANG SUDAH DITUGASKAN
  const [assigned] = await db.query(`
    SELECT
      id_user,
      role_penugasan
    FROM user_proyek
    WHERE id_proyek = ?
    AND role_penugasan IS NOT NULL
  `, [id]);

    res.json({
      users,
      assigned
    });

  } catch (error) {

    console.error(
      "GET ASSIGN ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data assignment"
    });
  }
};

// ================= SIMPAN ASSIGN USER PROYEK =================
export const saveAssignProyek = async (req, res) => {

  try {

    const { id } =
      req.params;

    const {
      admin,
      pengawas
    } = req.body;

    // 🔥 HAPUS ASSIGNMENT LAMA
    await db.query(`
      DELETE FROM user_proyek
      WHERE id_proyek = ?
    `, [id]);

    // 🔥 SIMPAN ADMIN
    if (admin) {

      await db.query(`
        INSERT INTO user_proyek
        (
          id_user,
          id_proyek,
          role_penugasan
        )
        VALUES (?, ?, ?)
      `, [
        admin,
        id,
        "admin"
      ]);
    }

    // 🔥 SIMPAN PENGAWAS
    if (
      Array.isArray(
        pengawas
      )
    ) {

      for (const idUser of pengawas) {

        await db.query(`
          INSERT INTO user_proyek
          (
            id_user,
            id_proyek,
            role_penugasan
          )
          VALUES (?, ?, ?)
        `, [
          idUser,
          id,
          "pengawas"
        ]);
      }
    }

    res.json({
      message:
        "Assignment berhasil disimpan"
    });

  } catch (error) {

    console.error(
      "SAVE ASSIGN ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menyimpan assignment"
    });
  }
};

// ================= DELETE PROYEK =================
export const deleteProyek = async (req, res) => {

  try {

    const id =
      Number(req.params.id);

    console.log(
      "DELETE ID:",
      id
    );

    const [result] = await db.query(
      "DELETE FROM proyek WHERE id_proyek = ?",
      [id]
    );

    console.log(
      "DELETE RESULT:",
      result
    );

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        message:
          "Proyek tidak ditemukan"
      });
    }

    res.json({
      message:
        "Proyek berhasil dihapus"
    });

  } catch (error) {

    console.error(
      "DELETE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Gagal hapus proyek"
    });
  }
};