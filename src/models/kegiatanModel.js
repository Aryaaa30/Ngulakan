const pool = require('../config/db');

const kegiatanModel = {
  // Ambil semua data kegiatan
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT id_kegiatan_desa, nama_kegiatan, tanggal_kegiatan, jam_kegiatan,
             alamat_kegiatan, deskripsi_kegiatan, foto,
             kategori_kegiatan, status_kegiatan, created_at, updated_at
      FROM kegiatan_desa
    `);
    return rows;
  },

  // Ambil kegiatan berdasarkan ID
  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM kegiatan_desa WHERE id_kegiatan_desa = ?',
      [id]
    );
    return rows[0];
  },

  // Tambah kegiatan baru
  create: async (data) => {
    const {
      nama_kegiatan,
      tanggal_kegiatan,
      jam_kegiatan,
      alamat_kegiatan,
      deskripsi_kegiatan,
      foto,
      kategori_kegiatan,
      status_kegiatan
    } = data;

    const [result] = await pool.query(
      `INSERT INTO kegiatan_desa
       (nama_kegiatan, tanggal_kegiatan, jam_kegiatan, alamat_kegiatan,
        deskripsi_kegiatan, foto, kategori_kegiatan, status_kegiatan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama_kegiatan,
        tanggal_kegiatan,
        jam_kegiatan,
        alamat_kegiatan,
        deskripsi_kegiatan,
        foto,
        kategori_kegiatan,
        status_kegiatan
      ]
    );

    return { id_kegiatan_desa: result.insertId };
  },

  // Update kegiatan berdasarkan ID
  update: async (id, data) => {
    const {
      nama_kegiatan,
      tanggal_kegiatan,
      jam_kegiatan,
      alamat_kegiatan,
      deskripsi_kegiatan,
      foto,
      kategori_kegiatan,
      status_kegiatan
    } = data;

    await pool.query(
      `UPDATE kegiatan_desa SET
         nama_kegiatan = ?,
         tanggal_kegiatan = ?,
         jam_kegiatan = ?,
         alamat_kegiatan = ?,
         deskripsi_kegiatan = ?,
         foto = ?,
         kategori_kegiatan = ?,
         status_kegiatan = ?
       WHERE id_kegiatan_desa = ?`,
      [
        nama_kegiatan,
        tanggal_kegiatan,
        jam_kegiatan,
        alamat_kegiatan,
        deskripsi_kegiatan,
        foto,
        kategori_kegiatan,
        status_kegiatan,
        id
      ]
    );

    return { id_kegiatan_desa: id };
  },

  // Hapus kegiatan
  delete: async (id) => {
    await pool.query('DELETE FROM kegiatan_desa WHERE id_kegiatan_desa = ?', [id]);
    return { id_kegiatan_desa: id };
  }
};

module.exports = kegiatanModel;
