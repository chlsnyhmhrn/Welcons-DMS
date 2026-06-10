import db from "../config/db.js";

export const logActivity = async ({
  id_user,
  id_dokumen,
  aktivitas,
  status_lama = null,
  status_baru = null,
  keterangan = null
}) => {

  console.log("LOG MASUK:", {
    id_user,
    id_dokumen,
    aktivitas
  });

  try {

    await db.query(
      `INSERT INTO log_aktivitas
      (
        id_user,
        id_dokumen,
        aktivitas,
        status_lama,
        status_baru,
        keterangan
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_user,
        id_dokumen,
        aktivitas,
        status_lama,
        status_baru,
        keterangan
      ]
    );

    console.log(
      "LOG BERHASIL:",
      id_user
    );

  } catch (err) {

    console.error(
      "ERROR LOG:",
      err
    );
  }
};