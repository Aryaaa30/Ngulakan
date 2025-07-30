const pengumumanModel = require('../models/pengumumanModel');

// Get all announcements
exports.list = async (req, res) => {
    try {
        const pengumuman = await pengumumanModel.getAll();
        res.render('admin/pengumuman/pengumumanList', { pengumuman, req, user: req.session.user });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).render('admin/pengumuman/pengumumanList', { 
            pengumuman: [], 
            error: 'Gagal memuat daftar pengumuman',
            req,
            user: req.session.user
        });
    }
};

// Show add announcement form
exports.showTambah = (req, res) => {
    res.render('admin/pengumuman/pengumumanTambah', { user: req.session.user });
};

// Add new announcement
exports.tambah = async (req, res) => {
    try {
        const { judul, isi, kategori, status, tanggal } = req.body;

        // Validation
        if (!judul || !isi || !kategori) {
            return res.render('admin/pengumuman/pengumumanTambah', {
                error: 'Judul, isi, dan kategori wajib diisi',
                user: req.session.user
            });
        }

        if (isi.length > 1000) {
            return res.render('admin/pengumuman/pengumumanTambah', {
                error: 'Isi pengumuman maksimal 1000 karakter',
                user: req.session.user
            });
        }

        // Create announcement
        const newPengumuman = {
            id_kegiatan_desa: null, // Optional, can be null
            nama_pengumuman: judul,
            tanggal_pengumuman: tanggal || new Date(),
            isi_pengumuman: isi,
            foto: null, // Optional, can be null
            kategori_pengumuman: kategori,
            status_pengumuman: status || 'Aktif',
            prioritas: 'Normal' // Default priority
        };

        await pengumumanModel.create(newPengumuman);

        res.redirect('/admin/pengumuman?success=Pengumuman berhasil ditambahkan');
    } catch (error) {
        console.error('Error adding announcement:', error);
        res.render('admin/pengumuman/pengumumanTambah', {
            error: 'Gagal menambahkan pengumuman',
            user: req.session.user
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
        res.render('admin/pengumuman/pengumumanEdit', { pengumuman, user: req.session.user });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.redirect('/admin/pengumuman?error=Gagal memuat data pengumuman');
    }
};

// Update announcement
exports.edit = async (req, res) => {
    try {
        const { judul, isi, kategori, status, tanggal } = req.body;
        const pengumumanId = req.params.id;

        // Validation
        if (!judul || !isi || !kategori) {
            return res.render('admin/pengumuman/pengumumanEdit', {
                pengumuman: { id_pengumuman_desa: pengumumanId, nama_pengumuman: judul, isi_pengumuman: isi, kategori_pengumuman: kategori, status_pengumuman: status, tanggal_pengumuman: tanggal },
                error: 'Judul, isi, dan kategori wajib diisi',
                user: req.session.user
            });
        }

        if (isi.length > 1000) {
            return res.render('admin/pengumuman/pengumumanEdit', {
                pengumuman: { id_pengumuman_desa: pengumumanId, nama_pengumuman: judul, isi_pengumuman: isi, kategori_pengumuman: kategori, status_pengumuman: status, tanggal_pengumuman: tanggal },
                error: 'Isi pengumuman maksimal 1000 karakter',
                user: req.session.user
            });
        }

        // Update announcement data
        const updateData = {
            id_kegiatan_desa: null, // Optional, can be null
            nama_pengumuman: judul,
            tanggal_pengumuman: tanggal,
            isi_pengumuman: isi,
            foto: null, // Optional, can be null
            kategori_pengumuman: kategori,
            status_pengumuman: status || 'Aktif',
            prioritas: 'Normal' // Default priority
        };

        await pengumumanModel.update(pengumumanId, updateData);

        res.redirect('/admin/pengumuman?success=Pengumuman berhasil diupdate');
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.render('admin/pengumuman/pengumumanEdit', {
            pengumuman: { id_pengumuman_desa: req.params.id, ...req.body },
            error: 'Gagal mengupdate pengumuman',
            user: req.session.user
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

        res.render('admin/pengumuman/pengumumanDetail', { pengumuman, pengumumanStats, user: req.session.user });
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
        const { status } = req.body;

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
            status_pengumuman: status,
            prioritas: pengumuman.prioritas
        };

        await pengumumanModel.update(pengumumanId, updateData);

        res.json({ success: true, message: `Status pengumuman berhasil diubah menjadi ${status}` });
    } catch (error) {
        console.error('Error toggling announcement status:', error);
        res.json({ success: false, message: 'Gagal mengubah status pengumuman' });
    }
};
