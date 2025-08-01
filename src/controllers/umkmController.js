// Toggle status Aktif/Tidak Aktif
exports.toggleStatus = async (req, res) => {
  try {
    const umkmId = req.params.id;
    const umkm = await umkmModel.getById(umkmId);
    if (!umkm) {
      return res.redirect('/admin/umkm?error=UMKM tidak ditemukan');
    }
    const newStatus = umkm.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    await umkmModel.update(umkmId, { ...umkm, status: newStatus });
    res.redirect('/admin/umkm?success=Status UMKM berhasil diubah');
  } catch (error) {
    console.error('Error toggling status:', error);
    res.redirect('/admin/umkm?error=Gagal mengubah status UMKM');
  }
};
const umkmModel = require('../models/umkmModel');
const path = require('path');
const multer = require('multer');

// Setup Multer untuk upload foto UMKM
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/foto/umkm'));
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
            const formData = {
                user: req.session.user,
                error: '',
                nama_umkm: req.body.nama_umkm || '',
                kategori_umkm: req.body.kategori_umkm || '',
                nama_pemilik: req.body.nama_pemilik || '',
                alamat: req.body.alamat || '',
                kontak: req.body.kontak || '',
                deskripsi: req.body.deskripsi || '',
                status: req.body.status || 'Aktif',
                currentPath: req.path
            };

            if (err.code === 'LIMIT_FILE_SIZE') {
                formData.error = 'Ukuran file foto maksimal 2 MB!';
            } else if (err.message === 'Hanya file gambar yang diperbolehkan!') {
                formData.error = 'Hanya file gambar (JPG, PNG, GIF) yang diperbolehkan!';
            }

            // Determine which form to render based on the path
            if (req.path.includes('/edit/')) {
                formData.umkm = { id_umkm: req.params.id, ...formData };
                return res.render('admin/umkm/umkmEdit', formData);
            } else {
                return res.render('admin/umkm/umkmTambah', formData);
            }
        }
        next();
    });
};

// Get all UMKM (for admin list view)
exports.list = async (req, res) => {
  try {
    const umkm = await umkmModel.getAll();
    
    // Get success/error messages from query params
    const success = req.query.success;
    const error = req.query.error;
    
    res.render('admin/umkm/umkmList', { 
      umkm, 
      user: req.session.user, 
      currentPath: req.path,
      success,
      error
    });
  } catch (error) {
    console.error('Error fetching UMKM:', error);
    res.status(500).render('admin/umkm/umkmList', { 
      umkm: [], 
      error: 'Gagal memuat daftar UMKM',
      user: req.session.user,
      currentPath: req.path
    });
  }
};

// Show add UMKM form
exports.showTambah = (req, res) => {
  res.render('admin/umkm/umkmTambah', { user: req.session.user, currentPath: req.path });
};

// Add new UMKM
exports.tambah = async (req, res) => {
  try {
    const { nama_umkm, deskripsi, alamat, kontak, kategori_umkm, status, nama_pemilik } = req.body;
    let foto = null;

    // Handle file upload
    if (req.file) {
      foto = req.file.filename;
    }

    // Validation
    if (!nama_umkm || !alamat || !nama_pemilik) {
      return res.render('admin/umkm/umkmTambah', {
        error: 'Nama UMKM, alamat, dan nama pemilik wajib diisi',
        nama_umkm: nama_umkm || '',
        kategori_umkm: kategori_umkm || '',
        nama_pemilik: nama_pemilik || '',
        alamat: alamat || '',
        kontak: kontak || '',
        deskripsi: deskripsi || '',
        status: status || 'Aktif',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Create UMKM
    const newUmkm = {
      nama_umkm: nama_umkm,
      kategori_umkm: kategori_umkm || 'Lainnya',
      nama_pemilik: nama_pemilik,
      alamat: alamat,
      deskripsi: deskripsi || null,
      kontak: kontak || null,
      foto: foto,
      status: status || 'Aktif'
    };

    await umkmModel.create(newUmkm);

    res.redirect('/admin/umkm?success=UMKM berhasil ditambahkan');
  } catch (error) {
    console.error('Error adding UMKM:', error);
    res.render('admin/umkm/umkmTambah', {
      error: 'Gagal menambahkan UMKM',
      nama_umkm: req.body.nama_umkm || '',
      kategori_umkm: req.body.kategori_umkm || '',
      nama_pemilik: req.body.nama_pemilik || '',
      alamat: req.body.alamat || '',
      kontak: req.body.kontak || '',
      deskripsi: req.body.deskripsi || '',
      status: req.body.status || 'Aktif',
      user: req.session.user,
      currentPath: req.path
    });
  }
};

// Show edit UMKM form
exports.showEdit = async (req, res) => {
  try {
    const umkm = await umkmModel.getById(req.params.id);
    if (!umkm) {
      return res.redirect('/admin/umkm?error=UMKM tidak ditemukan');
    }
    res.render('admin/umkm/umkmEdit', { umkm, user: req.session.user, currentPath: req.path });
  } catch (error) {
    console.error('Error fetching UMKM:', error);
    res.redirect('/admin/umkm?error=Gagal memuat data UMKM');
  }
};

// Update UMKM
exports.edit = async (req, res) => {
  try {
    const { nama_umkm, deskripsi, alamat, kontak, kategori_umkm, status, nama_pemilik } = req.body;
    const umkmId = req.params.id;
    let foto = null;

    // Handle file upload
    if (req.file) {
      foto = req.file.filename;
    }

    // Validation
    if (!nama_umkm || !alamat || !nama_pemilik) {
      return res.render('admin/umkm/umkmEdit', {
        umkm: { id_umkm: umkmId, nama_umkm: nama_umkm, deskripsi: deskripsi, alamat: alamat, kontak: kontak, kategori_umkm: kategori_umkm, status: status, nama_pemilik: nama_pemilik },
        error: 'Nama UMKM, alamat, dan nama pemilik wajib diisi',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Update UMKM data
    const updateData = {
      nama_umkm: nama_umkm,
      kategori_umkm: kategori_umkm || 'Lainnya',
      nama_pemilik: nama_pemilik,
      alamat: alamat,
      deskripsi: deskripsi || null,
      kontak: kontak || null,
      status: status || 'Aktif'
    };

    // Only update foto if new file is uploaded
    if (foto) {
      updateData.foto = foto;
    } else {
      updateData.foto = undefined; // This will prevent foto from being updated
    }

    await umkmModel.update(umkmId, updateData);

    res.redirect('/admin/umkm?success=UMKM berhasil diupdate');
  } catch (error) {
    console.error('Error updating UMKM:', error);
    res.render('admin/umkm/umkmEdit', {
      umkm: { id_umkm: req.params.id, nama_umkm: req.body.nama_umkm, deskripsi: req.body.deskripsi, alamat: req.body.alamat, kontak: req.body.kontak, kategori_umkm: req.body.kategori_umkm, status: req.body.status, nama_pemilik: req.body.nama_pemilik },
      error: 'Gagal mengupdate UMKM',
      user: req.session.user,
      currentPath: req.path
    });
  }
};

// Show UMKM detail
exports.detail = async (req, res) => {
  try {
    const umkm = await umkmModel.getById(req.params.id);
    if (!umkm) {
      return res.redirect('/admin/umkm?error=UMKM tidak ditemukan');
    }
    // Ambil semua UMKM untuk sidebar
    const umkmList = await umkmModel.getAll();
    res.render('admin/umkm/umkmDetail', { umkm, umkmList, user: req.session.user, currentPath: req.path });
  } catch (error) {
    console.error('Error fetching UMKM detail:', error);
    res.redirect('/admin/umkm?error=Gagal memuat detail UMKM');
  }
};

// Delete UMKM
exports.hapus = async (req, res) => {
  try {
    const umkmId = req.params.id;
    
    const umkm = await umkmModel.getById(umkmId);
    if (!umkm) {
      return res.redirect('/admin/umkm?error=UMKM tidak ditemukan');
    }

    await umkmModel.delete(umkmId);

    res.redirect('/admin/umkm?success=UMKM berhasil dihapus');
  } catch (error) {
    console.error('Error deleting UMKM:', error);
    res.redirect('/admin/umkm?error=Gagal menghapus UMKM');
  }
};

// Legacy methods for API compatibility
exports.getAll = async (req, res, next) => {
  try {
    const data = await umkmModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await umkmModel.getById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'UMKM not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await umkmModel.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await umkmModel.update(req.params.id, req.body);
    res.json({ id_umkm: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await umkmModel.delete(req.params.id);
    res.json({ id_umkm: req.params.id });
  } catch (err) {
    next(err);
  }
};
