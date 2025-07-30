const pool = require('../config/db');

const adminModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT id_admin, username, nama FROM admin');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id_admin, username, nama FROM admin WHERE id_admin = ?',
      [id]
    );
    return rows[0];
  },

  create: async ({ username, password, nama }) => {
    const [result] = await pool.query(
      'INSERT INTO admin (username, password, nama) VALUES (?, ?, ?)',
      [username, password, nama]
    );
    return { id_admin: result.insertId };
  },

  update: async (id, { username, password, nama }) => {
    await pool.query(
      'UPDATE admin SET username = ?, password = ?, nama = ? WHERE id_admin = ?',
      [username, password, nama, id]
    );
    return { id_admin: id };
  },

  delete: async (id) => {
    await pool.query('DELETE FROM admin WHERE id_admin = ?', [id]);
    return { id_admin: id };
  }
};

module.exports = adminModel;
