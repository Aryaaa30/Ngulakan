const pengumumanModel = require('../models/pengumumanModel');

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
exports.showTambah = (req, res) => {
    res.render('admin/pengumuman/pengumumanTambah', { user: req.session.user, currentPath: req.path });
};

// Add new announcement
exports.tambah = async (req, res) => {
    try {
        const { nama_pengumuman, tanggal_pengumuman, isi_pengumuman, kategori_pengumuman, status_pengumuman, prioritas } = req.body;

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
            id_kegiatan_desa: null, // Optional, can be null
            nama_pengumuman: nama_pengumuman,
            tanggal_pengumuman: tanggal_pengumuman || new Date().toISOString().split('T')[0],
            isi_pengumuman: isi_pengumuman,
            foto: null, // Optional, can be null
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
        res.render('admin/pengumuman/pengumumanEdit', { pengumuman, user: req.session.user, currentPath: req.path });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.redirect('/admin/pengumuman?error=Gagal memuat data pengumuman');
    }
};

// Update announcement
exports.edit = async (req, res) => {
    try {
        const { nama_pengumuman, tanggal_pengumuman, isi_pengumuman, kategori_pengumuman, status_pengumuman, prioritas } = req.body;
        const pengumumanId = req.params.id;

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
            id_kegiatan_desa: null, // Optional, can be null
            nama_pengumuman: nama_pengumuman,
            tanggal_pengumuman: tanggal_pengumuman,
            isi_pengumuman: isi_pengumuman,
            foto: null, // Optional, can be null
            kategori_pengumuman: kategori_pengumuman,
            status_pengumuman: status_pengumuman || 'Draft',
            prioritas: prioritas || 'Normal'
        };

        await pengumumanModel.update(pengumumanId, updateData);

        res.redirect('/admin/pengumuman?success=Pengumuman berhasil diupdate');
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

        // Get announcement statistics (placeholder for now)
        const pengumumanStats = {
            totalViews: 0,
            totalShares: 0
        };

        res.render('admin/pengumuman/pengumumanDetail', { pengumuman, pengumumanStats, user: req.session.user, currentPath: req.path });
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
