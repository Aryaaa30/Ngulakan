const umkmModel = require('../models/umkmModel');

// Get all UMKM (for admin list view)
exports.list = async (req, res) => {
  try {
    const umkm = await umkmModel.getAll();
    res.render('admin/umkm/umkmList', { umkm, user: req.session.user, currentPath: req.path });
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
    const { nama, deskripsi, alamat, kontak, kategori, status } = req.body;

    // Validation
    if (!nama || !deskripsi || !alamat) {
      return res.render('admin/umkm/umkmTambah', {
        error: 'Nama, deskripsi, dan alamat wajib diisi',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Create UMKM
    const newUmkm = {
      nama_umkm: nama,
      deskripsi_umkm: deskripsi,
      alamat_umkm: alamat,
      kontak_umkm: kontak || '',
      kategori_umkm: kategori || 'Lainnya',
      status_umkm: status || 'Aktif'
    };

    await umkmModel.create(newUmkm);

    res.redirect('/admin/umkm?success=UMKM berhasil ditambahkan');
  } catch (error) {
    console.error('Error adding UMKM:', error);
    res.render('admin/umkm/umkmTambah', {
      error: 'Gagal menambahkan UMKM',
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
    const { nama, deskripsi, alamat, kontak, kategori, status } = req.body;
    const umkmId = req.params.id;

    // Validation
    if (!nama || !deskripsi || !alamat) {
      return res.render('admin/umkm/umkmEdit', {
        umkm: { id_umkm: umkmId, nama_umkm: nama, deskripsi_umkm: deskripsi, alamat_umkm: alamat, kontak_umkm: kontak, kategori_umkm: kategori, status_umkm: status },
        error: 'Nama, deskripsi, dan alamat wajib diisi',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Update UMKM data
    const updateData = {
      nama_umkm: nama,
      deskripsi_umkm: deskripsi,
      alamat_umkm: alamat,
      kontak_umkm: kontak || '',
      kategori_umkm: kategori || 'Lainnya',
      status_umkm: status || 'Aktif'
    };

    await umkmModel.update(umkmId, updateData);

    res.redirect('/admin/umkm?success=UMKM berhasil diupdate');
  } catch (error) {
    console.error('Error updating UMKM:', error);
    res.render('admin/umkm/umkmEdit', {
      umkm: { id_umkm: req.params.id, ...req.body },
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

    res.render('admin/umkm/umkmDetail', { umkm, user: req.session.user, currentPath: req.path });
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
