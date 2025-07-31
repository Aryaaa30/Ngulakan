const pool = require('../config/db');

const umkmModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT id_umkm, nama_umkm, kategori_umkm, nama_pemilik,
             alamat, deskripsi, kontak, foto, status, created_at, updated_at
      FROM umkm
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM umkm WHERE id_umkm = ?',
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { nama_umkm, kategori_umkm, nama_pemilik, alamat, deskripsi, kontak, foto, status } = data;
    const [result] = await pool.query(
      `INSERT INTO umkm
       (nama_umkm, kategori_umkm, nama_pemilik, alamat, deskripsi, kontak, foto, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_umkm, kategori_umkm, nama_pemilik, alamat, deskripsi, kontak, foto, status]
    );
    return { id_umkm: result.insertId };
  },

  update: async (id, data) => {
    const { nama_umkm, kategori_umkm, nama_pemilik, alamat, deskripsi, kontak, foto, status } = data;
    
    // If foto is not provided, don't update it
    if (foto !== undefined) {
      await pool.query(
        `UPDATE umkm SET
           nama_umkm = ?, kategori_umkm = ?, nama_pemilik = ?, alamat = ?,
           deskripsi = ?, kontak = ?, foto = ?, status = ?
         WHERE id_umkm = ?`,
        [nama_umkm, kategori_umkm, nama_pemilik, alamat, deskripsi, kontak, foto, status, id]
      );
    } else {
      await pool.query(
        `UPDATE umkm SET
           nama_umkm = ?, kategori_umkm = ?, nama_pemilik = ?, alamat = ?,
           deskripsi = ?, kontak = ?, status = ?
         WHERE id_umkm = ?`,
        [nama_umkm, kategori_umkm, nama_pemilik, alamat, deskripsi, kontak, status, id]
      );
    }
    return { id_umkm: id };
  },

  delete: async (id) => {
    await pool.query('DELETE FROM umkm WHERE id_umkm = ?', [id]);
    return { id_umkm: id };
  }
};

module.exports = umkmModel;
