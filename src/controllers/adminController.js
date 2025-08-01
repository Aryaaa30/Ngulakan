// Toggle Status Admin
exports.toggleStatus = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await adminModel.getById(adminId);
        if (!admin) {
            return res.redirect('/admin/users?error=Admin tidak ditemukan');
        }
        // Toggle status
        const newStatus = admin.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
        await adminModel.update(adminId, {
            username: admin.username,
            nama: admin.nama,
            foto: admin.foto,
            status: newStatus
        });
        res.redirect('/admin/users?success=Status admin berhasil diubah');
    } catch (error) {
        console.error('Error in toggleStatus:', error);
        res.redirect('/admin/users?error=Gagal mengubah status admin');
    }
};
const adminModel = require('../models/adminModel');
const hashHelper = require('../utils/hashHelper');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for admin photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'src/uploads/foto/admin';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Upload middleware
exports.uploadMiddleware = upload.single('foto');

// Dashboard Admin
exports.dashboard = (req, res) => {
    res.render('admin/dashboardAdmin', { 
        user: req.session.user,
        currentPath: req.path 
    });
};

// List Admin
exports.list = async (req, res) => {
    try {
        const users = await adminModel.getAll();
        const success = req.query.success;
        const error = req.query.error;
        
        res.render('admin/user/userList', { 
            users, 
            success, 
            error,
            user: req.session.user,
            currentPath: req.path 
        });
    } catch (error) {
        console.error('Error in list:', error);
        res.render('admin/user/userList', { 
            users: [], 
            error: 'Terjadi kesalahan saat mengambil data admin',
            user: req.session.user,
            currentPath: req.path 
        });
    }
};

// Show Add Admin Form
exports.showAdd = (req, res) => {
    res.render('admin/user/userTambah', { 
        user: req.session.user,
        currentPath: req.path 
    });
};

// Add Admin
exports.tambah = async (req, res) => {
    try {
        const { nama, username, password, confirmPassword, status } = req.body;

        // Validation
        if (!nama || !username || !password) {
            return res.render('admin/user/userTambah', {
                error: 'Nama, username, dan password harus diisi',
                nama,
                username,
                status,
                user: req.session.user,
                currentPath: req.path
            });
        }

        if (password.length < 6) {
            return res.render('admin/user/userTambah', {
                error: 'Password minimal 6 karakter',
                nama,
                username,
                status,
                user: req.session.user,
                currentPath: req.path
            });
        }

        if (password !== confirmPassword) {
            return res.render('admin/user/userTambah', {
                error: 'Konfirmasi password tidak cocok',
                nama,
                username,
                status,
                user: req.session.user,
                currentPath: req.path
            });
        }

        // Check if username already exists
        const existingAdmin = await adminModel.getByUsername(username);
        if (existingAdmin) {
            return res.render('admin/user/userTambah', {
                error: 'Username sudah digunakan',
                nama,
                username,
                status,
                user: req.session.user,
                currentPath: req.path
            });
        }

        // Handle file upload
        let foto = null;
        if (req.file) {
            foto = req.file.filename;
        }

        // Hash password
        const hashedPassword = await hashHelper.hashPassword(password);

        // Create admin
        await adminModel.create({
            nama,
            username,
            password: hashedPassword,
            foto,
            status: status || 'Aktif'
        });

        res.redirect('/admin/users?success=Admin berhasil ditambahkan');
    } catch (error) {
        console.error('Error in tambah:', error);
        res.render('admin/user/userTambah', {
            error: 'Terjadi kesalahan saat menambahkan admin',
            nama: req.body.nama,
            username: req.body.username,
            status: req.body.status,
            user: req.session.user,
            currentPath: req.path
        });
    }
};

// Show Edit Admin Form
exports.showEdit = async (req, res) => {
    try {
        const user = await adminModel.getById(req.params.id);
        if (!user) {
            return res.redirect('/admin/users?error=Admin tidak ditemukan');
        }

        res.render('admin/user/userEdit', { 
            user,
            currentPath: req.path 
        });
    } catch (error) {
        console.error('Error in showEdit:', error);
        res.redirect('/admin/users?error=Terjadi kesalahan saat mengambil data admin');
    }
};

// Edit Admin
exports.edit = async (req, res) => {
    try {
        const { nama, username, newPassword, confirmPassword, status } = req.body;
        const adminId = req.params.id;

        // Validation
        if (!nama || !username) {
            return res.render('admin/user/userEdit', {
                error: 'Nama dan username harus diisi',
                user: { id_admin: adminId, nama, username, status },
                sessionUser: req.session.user,
                currentPath: req.path
            });
        }

        if (newPassword && newPassword.length < 6) {
            return res.render('admin/user/userEdit', {
                error: 'Password baru minimal 6 karakter',
                user: { id_admin: adminId, nama, username, status },
                sessionUser: req.session.user,
                currentPath: req.path
            });
        }

        if (newPassword && newPassword !== confirmPassword) {
            return res.render('admin/user/userEdit', {
                error: 'Konfirmasi password tidak cocok',
                user: { id_admin: adminId, nama, username, status },
                sessionUser: req.session.user,
                currentPath: req.path
            });
        }

        // Check if username already exists (excluding current admin)
        const existingAdmin = await adminModel.getByUsername(username);
        if (existingAdmin && existingAdmin.id_admin != adminId) {
            return res.render('admin/user/userEdit', {
                error: 'Username sudah digunakan',
                user: { id_admin: adminId, nama, username, status },
                sessionUser: req.session.user,
                currentPath: req.path
            });
        }

        // Get current admin data
        const currentAdmin = await adminModel.getById(adminId);
        if (!currentAdmin) {
            return res.redirect('/admin/users?error=Admin tidak ditemukan');
        }

        // Handle file upload
        let foto = currentAdmin.foto; // Keep existing photo by default
        if (req.file) {
            // Delete old photo if exists
            if (currentAdmin.foto) {
                const oldPhotoPath = path.join('src/uploads/foto/admin', currentAdmin.foto);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }
            foto = req.file.filename;
        }

        // Prepare update data
        const updateData = {
            nama,
            username,
            foto,
            status: status || 'Aktif'
        };

        // Add password if provided
        if (newPassword) {
            updateData.password = await hashHelper.hashPassword(newPassword);
        }

        // Update admin
        await adminModel.update(adminId, updateData);

        res.redirect('/admin/users?success=Admin berhasil diupdate');
    } catch (error) {
        console.error('Error in edit:', error);
        res.render('admin/user/userEdit', {
            error: 'Terjadi kesalahan saat mengupdate admin',
            user: { id_admin: req.params.id, ...req.body },
            sessionUser: req.session.user,
            currentPath: req.path
        });
    }
};

// Show Admin Detail
exports.detail = async (req, res) => {
    try {
        const user = await adminModel.getById(req.params.id);
        if (!user) {
            return res.redirect('/admin/users?error=Admin tidak ditemukan');
        }
        // Ambil semua admin untuk sidebar
        const usersList = await adminModel.getAll();
        res.render('admin/user/userDetail', { 
            user,
            usersList,
            currentPath: req.path 
        });
    } catch (error) {
        console.error('Error in detail:', error);
        res.redirect('/admin/users?error=Terjadi kesalahan saat mengambil detail admin');
    }
};

// Delete Admin
exports.hapus = async (req, res) => {
    try {
        const adminId = req.params.id;
        
        // Check if admin exists
        const admin = await adminModel.getById(adminId);
        if (!admin) {
            return res.redirect('/admin/users?error=Admin tidak ditemukan');
        }

        // Delete photo file if exists
        if (admin.foto) {
            const photoPath = path.join('src/uploads/foto/admin', admin.foto);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        // Delete admin
        await adminModel.delete(adminId);

        res.redirect('/admin/users?success=Admin berhasil dihapus');
    } catch (error) {
        console.error('Error in hapus:', error);
        res.redirect('/admin/users?error=Terjadi kesalahan saat menghapus admin');
    }
};
