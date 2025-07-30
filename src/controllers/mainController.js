// src/controllers/mainController.js
const kegiatanController = require('./kegiatanController');

exports.dashboard = (req, res) => {
  res.render('public/dashboardPublic', { title: 'Dashboard Desa' });
};

exports.loginForm = (req, res) => {
  res.render('public/login', { title: 'Login' });
};

exports.berkasList = async (req, res, next) => {
  try {
    const list = await kegiatanController.getAll();
    res.render('public/berkas', {
      title: 'Daftar Berkas',
      kegiatan: list
    });
  } catch (err) {
    next(err);
  }
};

exports.berkasDetail = async (req, res, next) => {
  try {
    const item = await kegiatanController.getById(req.params.id);
    if (!item) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Data tidak ditemukan'
      });
    }
    res.render('public/berkas', {
      title: 'Detail Berkas',
      item
    });
  } catch (err) {
    next(err);
  }
};
