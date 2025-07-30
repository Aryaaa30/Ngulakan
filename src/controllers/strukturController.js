const strukturModel = require('../models/strukturModel');

// Get all struktur (for admin list view)
exports.list = async (req, res) => {
  try {
    const struktur = await strukturModel.getAll();
    res.render('admin/struktur/strukturList', { struktur, user: req.session.user, currentPath: req.path });
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
    const { nama, jabatan, deskripsi, status } = req.body;

    // Validation
    if (!nama || !jabatan) {
      return res.render('admin/struktur/strukturTambah', {
        error: 'Nama dan jabatan wajib diisi',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Create struktur
    const newStruktur = {
      nama_struktur: nama,
      jabatan_struktur: jabatan,
      deskripsi_struktur: deskripsi || '',
      status_struktur: status || 'Aktif'
    };

    await strukturModel.create(newStruktur);

    res.redirect('/admin/struktur?success=Struktur berhasil ditambahkan');
  } catch (error) {
    console.error('Error adding struktur:', error);
    res.render('admin/struktur/strukturTambah', {
      error: 'Gagal menambahkan struktur',
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
    const { nama, jabatan, deskripsi, status } = req.body;
    const strukturId = req.params.id;

    // Validation
    if (!nama || !jabatan) {
      return res.render('admin/struktur/strukturEdit', {
        struktur: { id_struktur: strukturId, nama_struktur: nama, jabatan_struktur: jabatan, deskripsi_struktur: deskripsi, status_struktur: status },
        error: 'Nama dan jabatan wajib diisi',
        user: req.session.user,
        currentPath: req.path
      });
    }

    // Update struktur data
    const updateData = {
      nama_struktur: nama,
      jabatan_struktur: jabatan,
      deskripsi_struktur: deskripsi || '',
      status_struktur: status || 'Aktif'
    };

    await strukturModel.update(strukturId, updateData);

    res.redirect('/admin/struktur?success=Struktur berhasil diupdate');
  } catch (error) {
    console.error('Error updating struktur:', error);
    res.render('admin/struktur/strukturEdit', {
      struktur: { id_struktur: req.params.id, ...req.body },
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

    res.render('admin/struktur/strukturDetail', { struktur, user: req.session.user, currentPath: req.path });
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
