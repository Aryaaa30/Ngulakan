// Public: List kegiatan
exports.publicList = async (req, res) => {
  try {
    const kegiatan = await kegiatanModel.getAll();
    res.render('public/kegiatan/kegiatanListPublic', { kegiatan });
  } catch (error) {
    res.status(500).render('public/kegiatan/kegiatanListPublic', { kegiatan: [], error: 'Gagal memuat daftar kegiatan' });
  }
};

// Public: Detail kegiatan
exports.publicDetail = async (req, res) => {
  try {
    const kegiatan = await kegiatanModel.getById(req.params.id);
    if (!kegiatan) {
      return res.redirect('/kegiatan?error=Kegiatan tidak ditemukan');
    }
    const kegiatanList = await kegiatanModel.getAll();
    res.render('public/kegiatan/kegiatanDetailPublic', { kegiatan, kegiatanList });
  } catch (error) {
    res.redirect('/kegiatan?error=Gagal memuat detail kegiatan');
  }
};
const kegiatanModel = require('../models/kegiatanModel');
const path = require('path');
const multer = require('multer');

// Setup Multer dengan limit 1 MB
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/foto/kegiatan')); // dari src/controllers ke src/uploads/foto/kegiatan
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 } // 1 MB
});

// Middleware untuk handle upload dan validasi ukuran
exports.uploadMiddleware = (req, res, next) => {
    upload.single('foto')(req, res, function (err) {
        if (err && err.code === 'LIMIT_FILE_SIZE') {
            // Jika sedang tambah
            if (req.url.includes('/tambah')) {
                return res.render('admin/kegiatan/kegiatanTambah', {
                    user: req.session.user,
                    error: 'Ukuran file foto maksimal 1 MB!',
                    currentPath: req.path
                });
            }
            // Jika sedang edit
            if (req.url.includes('/edit')) {
                kegiatanModel.getById(req.params.id).then(kegiatan => {
                    res.render('admin/kegiatan/kegiatanEdit', {
                        kegiatan,
                        user: req.session.user,
                        error: 'Ukuran file foto maksimal 1 MB!',
                        currentPath: req.path
                    });
                });
                return;
            }
        }
        next();
    });
};

// Menampilkan daftar kegiatan
exports.list = async (req, res) => {
    const kegiatan = await kegiatanModel.getAll();
    res.render('admin/kegiatan/kegiatanList', {
        kegiatan,
        user: req.session.user,
        currentPath: req.path
    });
};

// Menampilkan detail kegiatan
exports.detail = async (req, res) => {
    const kegiatan = await kegiatanModel.getById(req.params.id);
    const kegiatanList = await kegiatanModel.getAll();
    res.render('admin/kegiatan/kegiatanDetail', {
        kegiatan,
        kegiatanList,
        user: req.session.user,
        currentPath: req.path
    });
};

// Menampilkan form tambah kegiatan
exports.showTambah = (req, res) => {
    res.render('admin/kegiatan/kegiatanTambah', {
        user: req.session.user,
        currentPath: req.path
    });
};

// Menyimpan data kegiatan baru
exports.tambah = async (req, res) => {
    const fotoPath = req.file ? '/uploads/foto/kegiatan/' + req.file.filename : '';
    const {
        nama_kegiatan,
        tanggal_kegiatan,
        jam_kegiatan,
        alamat_kegiatan,
        deskripsi_kegiatan,
        kategori_kegiatan,
        status_kegiatan
    } = req.body || {};

    if (!nama_kegiatan) {
        return res.render('admin/kegiatan/kegiatanTambah', {
            user: req.session.user,
            error: 'Nama kegiatan wajib diisi!',
            currentPath: req.path
        });
    }

    await kegiatanModel.create({
        nama_kegiatan,
        tanggal_kegiatan,
        jam_kegiatan,
        alamat_kegiatan,
        deskripsi_kegiatan,
        foto: fotoPath,
        kategori_kegiatan,
        status_kegiatan
    });

    res.redirect('/admin/kegiatan');
};

// Menampilkan form edit kegiatan
exports.showEdit = async (req, res) => {
    const kegiatan = await kegiatanModel.getById(req.params.id);
    res.render('admin/kegiatan/kegiatanEdit', {
        kegiatan,
        user: req.session.user,
        currentPath: req.path
    });
};

// Menyimpan perubahan data kegiatan
exports.edit = async (req, res) => {
    const foto_lama = (req.body && req.body.foto_lama) ? req.body.foto_lama : '';
    const fotoPath = req.file ? '/uploads/foto/kegiatan/' + req.file.filename : foto_lama;
    const {
        nama_kegiatan,
        tanggal_kegiatan,
        jam_kegiatan,
        alamat_kegiatan,
        deskripsi_kegiatan,
        kategori_kegiatan,
        status_kegiatan
    } = req.body || {};

    await kegiatanModel.update(req.params.id, {
        nama_kegiatan,
        tanggal_kegiatan,
        jam_kegiatan,
        alamat_kegiatan,
        deskripsi_kegiatan,
        foto: fotoPath,
        kategori_kegiatan,
        status_kegiatan
    });

    res.redirect('/admin/kegiatan');
};

// Menghapus data kegiatan
exports.hapus = async (req, res) => {
    await kegiatanModel.delete(req.params.id);
    res.redirect('/admin/kegiatan');
};
