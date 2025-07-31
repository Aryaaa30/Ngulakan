const pool = require('../config/db');

const pengumumanModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT p.id_pengumuman_desa, p.id_kegiatan_desa, p.nama_pengumuman,
             p.tanggal_pengumuman, p.isi_pengumuman, p.foto,
             p.kategori_pengumuman, p.status_pengumuman, p.prioritas,
             p.created_at, p.updated_at,
             k.nama_kegiatan
      FROM pengumuman_desa p
      LEFT JOIN kegiatan_desa k ON p.id_kegiatan_desa = k.id_kegiatan_desa
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM pengumuman_desa WHERE id_pengumuman_desa = ?',
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { id_kegiatan_desa, nama_pengumuman, tanggal_pengumuman, isi_pengumuman, foto, kategori_pengumuman, status_pengumuman, prioritas } = data;
    const [result] = await pool.query(
      `INSERT INTO pengumuman_desa
       (id_kegiatan_desa, nama_pengumuman, tanggal_pengumuman,
        isi_pengumuman, foto, kategori_pengumuman, status_pengumuman, prioritas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_kegiatan_desa, nama_pengumuman, tanggal_pengumuman, isi_pengumuman, foto, kategori_pengumuman, status_pengumuman, prioritas]
    );
    return { id_pengumuman_desa: result.insertId };
  },

  update: async (id, data) => {
    const { id_kegiatan_desa, nama_pengumuman, tanggal_pengumuman, isi_pengumuman, foto, kategori_pengumuman, status_pengumuman, prioritas } = data;
    await pool.query(
      `UPDATE pengumuman_desa SET
         id_kegiatan_desa = ?, nama_pengumuman = ?, tanggal_pengumuman = ?,
         isi_pengumuman = ?, foto = ?, kategori_pengumuman = ?,
         status_pengumuman = ?, prioritas = ?
       WHERE id_pengumuman_desa = ?`,
      [id_kegiatan_desa, nama_pengumuman, tanggal_pengumuman, isi_pengumuman, foto, kategori_pengumuman, status_pengumuman, prioritas, id]
    );
    return { id_pengumuman_desa: id };
  },

  delete: async (id) => {
    await pool.query('DELETE FROM pengumuman_desa WHERE id_pengumuman_desa = ?', [id]);
    return { id_pengumuman_desa: id };
  }
};

module.exports = pengumumanModel;
