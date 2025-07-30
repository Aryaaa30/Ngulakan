const pool = require('../config/db');

const strukturModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT id_struktur, nama, jabatan, foto, kontak, created_at, updated_at
      FROM struktur_padukuhan
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM struktur_padukuhan WHERE id_struktur = ?',
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { nama, jabatan, foto, kontak } = data;
    const [result] = await pool.query(
      `INSERT INTO struktur_padukuhan (nama, jabatan, foto, kontak)
       VALUES (?, ?, ?, ?)`,
      [nama, jabatan, foto, kontak]
    );
    return { id_struktur: result.insertId };
  },

  update: async (id, data) => {
    const { nama, jabatan, foto, kontak } = data;
    await pool.query(
      `UPDATE struktur_padukuhan
       SET nama = ?, jabatan = ?, foto = ?, kontak = ?
       WHERE id_struktur = ?`,
      [nama, jabatan, foto, kontak, id]
    );
    return { id_struktur: id };
  },

  delete: async (id) => {
    await pool.query('DELETE FROM struktur_padukuhan WHERE id_struktur = ?', [id]);
    return { id_struktur: id };
  }
};

module.exports = strukturModel;
