const pool = require('../config/db');

const adminModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT id_admin, username, nama, foto, status, created_at, updated_at 
      FROM admin 
      ORDER BY created_at DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id_admin, username, nama, foto, status, created_at, updated_at FROM admin WHERE id_admin = ?',
      [id]
    );
    return rows[0];
  },

  getByUsername: async (username) => {
    const [rows] = await pool.query(
      'SELECT id_admin, username, nama, foto, status FROM admin WHERE username = ?',
      [username]
    );
    return rows[0];
  },

  create: async ({ username, password, nama, foto, status }) => {
    const [result] = await pool.query(
      'INSERT INTO admin (username, password, nama, foto, status) VALUES (?, ?, ?, ?, ?)',
      [username, password, nama, foto, status]
    );
    return { id_admin: result.insertId };
  },

  update: async (id, updateData) => {
    const { username, password, nama, foto, status } = updateData;
    
    if (password) {
      // Update with password
      await pool.query(
        'UPDATE admin SET username = ?, password = ?, nama = ?, foto = ?, status = ? WHERE id_admin = ?',
        [username, password, nama, foto, status, id]
      );
    } else {
      // Update without password
      await pool.query(
        'UPDATE admin SET username = ?, nama = ?, foto = ?, status = ? WHERE id_admin = ?',
        [username, nama, foto, status, id]
      );
    }
    
    return { id_admin: id };
  },

  delete: async (id) => {
    await pool.query('DELETE FROM admin WHERE id_admin = ?', [id]);
    return { id_admin: id };
  }
};

module.exports = adminModel;
