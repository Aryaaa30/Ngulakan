// Public: List pengumuman
exports.publicList = async (req, res) => {
  try {
    const pengumuman = await pengumumanModel.getAll();
    res.render('public/pengumuman/pengumumanListPublic', { pengumuman });
  } catch (error) {
    res.status(500).render('public/pengumuman/pengumumanListPublic', { pengumuman: [], error: 'Gagal memuat daftar pengumuman' });
  }
};

// Public: Detail pengumuman
exports.publicDetail = async (req, res) => {
  try {
    const pengumuman = await pengumumanModel.getById(req.params.id);
    if (!pengumuman) {
      return res.redirect('/pengumuman?error=Pengumuman tidak ditemukan');
    }
    let kegiatanUtama = null;
    if (pengumuman && pengumuman.id_kegiatan_desa) {
      kegiatanUtama = await kegiatanModel.getById(pengumuman.id_kegiatan_desa);
    }
    // Ambil semua pengumuman untuk bagian pengumuman lainnya
    const pengumumanList = await pengumumanModel.getAll();
    // Ambil semua kegiatan desa untuk mapping di pengumuman lainnya
    const kegiatanDesaList = await kegiatanModel.getAll();
    res.render('public/pengumuman/pengumumanDetailPublic', {
      pengumuman,
      kegiatanUtama,
      pengumumanList,
      kegiatanDesaList
    });
  } catch (error) {
    res.redirect('/pengumuman?error=Gagal memuat detail pengumuman');
  }
};
const pengumumanModel = require('../models/pengumumanModel');
const kegiatanModel = require('../models/kegiatanModel');

// Get all announcements
exports.list = async (req, res) => {
    try {
        const pengumuman = await pengumumanModel.getAll();
        res.render('admin/pengumuman/pengumumanList', { pengumuman, user: req.session.user, currentPath: req.path });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).render('admin/pengumuman/pengumumanList', { 
            pengumuman: [], 
            error: 'Gagal memuat daftar pengumuman',
            user: req.session.user,
            currentPath: req.path
        });
    }
};

// Show add announcement form
exports.showTambah = async (req, res) => {
    const kegiatanDesa = await kegiatanModel.getAll();
    res.render('admin/pengumuman/pengumumanTambah', { kegiatanDesa, user: req.session.user, currentPath: req.path });
};

// Add new announcement
exports.tambah = async (req, res) => {
    try {
        const { id_kegiatan_desa, nama_pengumuman, tanggal_pengumuman, isi_pengumuman, kategori_pengumuman, status_pengumuman, prioritas } = req.body;
        let foto = null;
        if (req.file) {
            foto = req.file.filename;
        }

        // Validation
        if (!nama_pengumuman || !isi_pengumuman || !kategori_pengumuman) {
            return res.render('admin/pengumuman/pengumumanTambah', {
                error: 'Nama pengumuman, isi, dan kategori wajib diisi',
                user: req.session.user,
                currentPath: req.path
            });
        }

        if (isi_pengumuman.length > 1000) {
            return res.render('admin/pengumuman/pengumumanTambah', {
                error: 'Isi pengumuman maksimal 1000 karakter',
                user: req.session.user,
                currentPath: req.path
            });
        }

        // Create announcement
        const newPengumuman = {
            id_kegiatan_desa,
            nama_pengumuman: nama_pengumuman,
            tanggal_pengumuman: tanggal_pengumuman || new Date().toISOString().split('T')[0],
            isi_pengumuman: isi_pengumuman,
            foto: foto,
            kategori_pengumuman: kategori_pengumuman,
            status_pengumuman: status_pengumuman || 'Draft',
            prioritas: prioritas || 'Normal'
        };

        await pengumumanModel.create(newPengumuman);

        res.redirect('/admin/pengumuman?success=Pengumuman berhasil ditambahkan');
    } catch (error) {
        console.error('Error adding announcement:', error);
        res.render('admin/pengumuman/pengumumanTambah', {
            error: 'Gagal menambahkan pengumuman',
            user: req.session.user,
            currentPath: req.path
        });
    }
};

// Show edit announcement form
exports.showEdit = async (req, res) => {
    try {
        const pengumuman = await pengumumanModel.getById(req.params.id);
        if (!pengumuman) {
            return res.redirect('/admin/pengumuman?error=Pengumuman tidak ditemukan');
        }
        const kegiatanDesa = await kegiatanModel.getAll();
        const success = req.query.success;
        res.render('admin/pengumuman/pengumumanEdit', { pengumuman, kegiatanDesa, user: req.session.user, currentPath: req.path, success });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.redirect('/admin/pengumuman?error=Gagal memuat data pengumuman');
    }
};

// Update announcement
exports.edit = async (req, res) => {
    try {
        const { nama_pengumuman, tanggal_pengumuman, isi_pengumuman, kategori_pengumuman, status_pengumuman, prioritas, id_kegiatan_desa } = req.body;
        const pengumumanId = req.params.id;
        let foto = null;
        if (req.file) {
            foto = req.file.filename;
        }

        // Validation
        if (!nama_pengumuman || !isi_pengumuman || !kategori_pengumuman) {
            return res.render('admin/pengumuman/pengumumanEdit', {
                pengumuman: { id_pengumuman_desa: pengumumanId, nama_pengumuman, tanggal_pengumuman, isi_pengumuman, kategori_pengumuman, status_pengumuman, prioritas },
                error: 'Nama pengumuman, isi, dan kategori wajib diisi',
                user: req.session.user,
                currentPath: req.path
            });
        }

        if (isi_pengumuman.length > 1000) {
            return res.render('admin/pengumuman/pengumumanEdit', {
                pengumuman: { id_pengumuman_desa: pengumumanId, nama_pengumuman, tanggal_pengumuman, isi_pengumuman, kategori_pengumuman, status_pengumuman, prioritas },
                error: 'Isi pengumuman maksimal 1000 karakter',
                user: req.session.user,
                currentPath: req.path
            });
        }

        // Update announcement data
        const updateData = {
            id_kegiatan_desa: id_kegiatan_desa || null,
            nama_pengumuman: nama_pengumuman,
            tanggal_pengumuman: tanggal_pengumuman,
            isi_pengumuman: isi_pengumuman,
            kategori_pengumuman: kategori_pengumuman,
            status_pengumuman: status_pengumuman || 'Draft',
            prioritas: prioritas || 'Normal'
        };
        if (foto) {
            updateData.foto = foto;
        }

        await pengumumanModel.update(pengumumanId, updateData);

        // Redirect ke halaman pengumumanList dengan pesan sukses
        res.redirect(`/admin/pengumuman?success=Pengumuman berhasil diupdate`);
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.render('admin/pengumuman/pengumumanEdit', {
            pengumuman: { id_pengumuman_desa: req.params.id, ...req.body },
            error: 'Gagal mengupdate pengumuman',
            user: req.session.user,
            currentPath: req.path
        });
    }
};

// Show announcement detail
exports.detail = async (req, res) => {
    try {
        const pengumuman = await pengumumanModel.getById(req.params.id);
        if (!pengumuman) {
            return res.redirect('/admin/pengumuman?error=Pengumuman tidak ditemukan');
        }

        // Ambil semua pengumuman lain (selain yang sedang dibuka)
        const allPengumuman = await pengumumanModel.getAll();
        const pengumumanList = allPengumuman.filter(item => item.id_pengumuman_desa != req.params.id);

        // Ambil data kegiatan untuk setiap pengumuman di pengumumanList
        const kegiatanIds = pengumumanList.map(item => item.id_kegiatan_desa).filter(id => !!id);
        let kegiatanDesaList = [];
        if (kegiatanIds.length > 0) {
            // Ambil semua kegiatan yang diperlukan sekaligus
            const uniqueIds = [...new Set(kegiatanIds)];
            const kegiatanPromises = uniqueIds.map(id => require('../models/kegiatanModel').getById(id));
            const kegiatanResults = await Promise.all(kegiatanPromises);
            kegiatanDesaList = kegiatanResults.filter(Boolean);
        }

        // Ambil data kegiatan desa utama untuk pengumuman yang sedang dibuka
        let kegiatanUtama = null;
        if (pengumuman.id_kegiatan_desa) {
            kegiatanUtama = await require('../models/kegiatanModel').getById(pengumuman.id_kegiatan_desa);
        }

        res.render('admin/pengumuman/pengumumanDetail', {
            pengumuman,
            pengumumanList,
            kegiatanDesaList,
            kegiatanUtama,
            user: req.session.user,
            currentPath: req.path
        });
    } catch (error) {
        console.error('Error fetching announcement detail:', error);
        res.redirect('/admin/pengumuman?error=Gagal memuat detail pengumuman');
    }
};

// Delete announcement
exports.hapus = async (req, res) => {
    try {
        const pengumumanId = req.params.id;
        
        const pengumuman = await pengumumanModel.getById(pengumumanId);
        if (!pengumuman) {
            return res.redirect('/admin/pengumuman?error=Pengumuman tidak ditemukan');
        }

        await pengumumanModel.delete(pengumumanId);

        res.redirect('/admin/pengumuman?success=Pengumuman berhasil dihapus');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.redirect('/admin/pengumuman?error=Gagal menghapus pengumuman');
    }
};

// Toggle announcement status
exports.toggleStatus = async (req, res) => {
    try {
        const pengumumanId = req.params.id;
        const { status_pengumuman } = req.body;

        const pengumuman = await pengumumanModel.getById(pengumumanId);
        if (!pengumuman) {
            return res.json({ success: false, message: 'Pengumuman tidak ditemukan' });
        }

        const updateData = {
            id_kegiatan_desa: pengumuman.id_kegiatan_desa,
            nama_pengumuman: pengumuman.nama_pengumuman,
            tanggal_pengumuman: pengumuman.tanggal_pengumuman,
            isi_pengumuman: pengumuman.isi_pengumuman,
            foto: pengumuman.foto,
            kategori_pengumuman: pengumuman.kategori_pengumuman,
            status_pengumuman: status_pengumuman,
            prioritas: pengumuman.prioritas
        };

        await pengumumanModel.update(pengumumanId, updateData);

        res.json({ success: true, message: `Status pengumuman berhasil diubah menjadi ${status_pengumuman}` });
    } catch (error) {
        console.error('Error toggling announcement status:', error);
        res.json({ success: false, message: 'Gagal mengubah status pengumuman' });
    }
};
