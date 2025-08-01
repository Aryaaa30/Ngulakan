const strukturModel = require('../models/strukturModel');
const path = require('path');
const multer = require('multer');

// Setup Multer untuk upload foto struktur
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/foto/struktur'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: function (req, file, cb) {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
        }
    }
});

// Middleware untuk handle upload
exports.uploadMiddleware = (req, res, next) => {
    upload.single('foto')(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.render('admin/struktur/strukturTambah', {
                    user: req.session.user,
                    error: 'Ukuran file foto maksimal 2 MB!',
                    nama: req.body.nama || '',
                    jabatan: req.body.jabatan || '',
                    kontak: req.body.kontak || '',
                    currentPath: req.path
                });
            }
            if (err.message === 'Hanya file gambar yang diperbolehkan!') {
                return res.render('admin/struktur/strukturTambah', {
                    user: req.session.user,
                    error: 'Hanya file gambar (JPG, PNG, GIF) yang diperbolehkan!',
                    nama: req.body.nama || '',
                    jabatan: req.body.jabatan || '',
                    kontak: req.body.kontak || '',
                    currentPath: req.path
                });
            }
        }
        next();
    });
};

// Get all struktur (for admin list view)
exports.list = async (req, res) => {
  try {
    const struktur = await strukturModel.getAll();
    
    // Get success/error messages from query params
    const success = req.query.success;
    const error = req.query.error;
    
    res.render('admin/struktur/strukturList', { 
      struktur, 
      user: req.session.user, 
      currentPath: req.path,
      success,
      error
    });
  } catch (error) {
    console.error('Error fetching struktur:', error);
    res.status(500).render('admin/struktur/strukturList', { 
      struktur: [], 
      error: 'Gagal memuat daftar struktur',
      user: req.session.user,
      currentPath: req.path
    });
  }
};

// Show add struktur form
exports.showTambah = (req, res) => {
  res.render('admin/struktur/strukturTambah', { user: req.session.user, currentPath: req.path });
};

// Add new struktur
exports.tambah = async (req, res) => {
  try {
    const { nama, jabatan, kontak } = req.body;
    let foto = null;

    // Handle file upload
    if (req.file) {
      foto = req.file.filename;
    }

    // Validation
    if (!nama || !jabatan) {
      return res.render('admin/struktur/strukturTambah', {
        error: 'Nama dan jabatan wajib diisi',
        nama: nama || '',
        jabatan: jabatan || '',
        kontak: kontak || '',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Create struktur
    const newStruktur = {
      nama: nama,
      jabatan: jabatan,
      foto: foto,
      kontak: kontak || null
    };

    await strukturModel.create(newStruktur);

    res.redirect('/admin/struktur?success=Struktur berhasil ditambahkan');
  } catch (error) {
    console.error('Error adding struktur:', error);
    res.render('admin/struktur/strukturTambah', {
      error: 'Gagal menambahkan struktur',
      nama: req.body.nama || '',
      jabatan: req.body.jabatan || '',
      kontak: req.body.kontak || '',
      user: req.session.user,
      currentPath: req.path
    });
  }
};

// Show edit struktur form
exports.showEdit = async (req, res) => {
  try {
    const struktur = await strukturModel.getById(req.params.id);
    if (!struktur) {
      return res.redirect('/admin/struktur?error=Struktur tidak ditemukan');
    }
    res.render('admin/struktur/strukturEdit', { struktur, user: req.session.user, currentPath: req.path });
  } catch (error) {
    console.error('Error fetching struktur:', error);
    res.redirect('/admin/struktur?error=Gagal memuat data struktur');
  }
};

// Update struktur
exports.edit = async (req, res) => {
  try {
    const { nama, jabatan, kontak } = req.body;
    const strukturId = req.params.id;
    let foto = null;

    // Handle file upload
    if (req.file) {
      foto = req.file.filename;
    }

    // Validation
    if (!nama || !jabatan) {
      return res.render('admin/struktur/strukturEdit', {
        struktur: { id_struktur: strukturId, nama: nama, jabatan: jabatan, kontak: kontak },
        error: 'Nama dan jabatan wajib diisi',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Update struktur data
    const updateData = {
      nama: nama,
      jabatan: jabatan,
      kontak: kontak || null
    };

    // Only update foto if new file is uploaded
    if (foto) {
      updateData.foto = foto;
    }

    await strukturModel.update(strukturId, updateData);

    res.redirect('/admin/struktur?success=Struktur berhasil diupdate');
  } catch (error) {
    console.error('Error updating struktur:', error);
    res.render('admin/struktur/strukturEdit', {
      struktur: { id_struktur: req.params.id, nama: req.body.nama, jabatan: req.body.jabatan, kontak: req.body.kontak },
      error: 'Gagal mengupdate struktur',
      user: req.session.user,
      currentPath: req.path
    });
  }
};

// Show struktur detail
exports.detail = async (req, res) => {
  try {
    const struktur = await strukturModel.getById(req.params.id);
    if (!struktur) {
      return res.redirect('/admin/struktur?error=Struktur tidak ditemukan');
    }
    // Ambil semua struktur untuk sidebar
    const strukturList = await strukturModel.getAll();
    res.render('admin/struktur/strukturDetail', { struktur, strukturList, user: req.session.user, currentPath: req.path });
  } catch (error) {
    console.error('Error fetching struktur detail:', error);
    res.redirect('/admin/struktur?error=Gagal memuat detail struktur');
  }
};

// Delete struktur
exports.hapus = async (req, res) => {
  try {
    const strukturId = req.params.id;
    
    const struktur = await strukturModel.getById(strukturId);
    if (!struktur) {
      return res.redirect('/admin/struktur?error=Struktur tidak ditemukan');
    }

    await strukturModel.delete(strukturId);

    res.redirect('/admin/struktur?success=Struktur berhasil dihapus');
  } catch (error) {
    console.error('Error deleting struktur:', error);
    res.redirect('/admin/struktur?error=Gagal menghapus struktur');
  }
};

// Legacy methods for API compatibility
exports.getAll = async (req, res, next) => {
  try {
    const list = await strukturModel.getAll();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await strukturModel.getById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await strukturModel.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await strukturModel.update(req.params.id, req.body);
    res.json({ id_struktur: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await strukturModel.delete(req.params.id);
    res.json({ id_struktur: req.params.id });
  } catch (err) {
    next(err);
  }
};
