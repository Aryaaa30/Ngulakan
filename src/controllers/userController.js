const User = require('../models/User');
const hashHelper = require('../utils/hashHelper');

// Get all users
exports.list = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ created_at: -1 });
        res.render('admin/user/userList', { users, req, user: req.session.user });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('admin/user/userList', { 
            users: [], 
            error: 'Gagal memuat daftar user',
            req,
            user: req.session.user
        });
    }
};

// Show add user form
exports.showTambah = (req, res) => {
    res.render('admin/user/userTambah', { user: req.session.user });
};

// Add new user
exports.tambah = async (req, res) => {
    try {
        const { nama, email, password, confirmPassword, role, status } = req.body;

        // Validation
        if (!nama || !email || !password || !role) {
            return res.render('admin/user/userTambah', {
                error: 'Semua field wajib diisi',
                user: req.session.user
            });
        }

        if (password !== confirmPassword) {
            return res.render('admin/user/userTambah', {
                error: 'Konfirmasi password tidak cocok',
                user: req.session.user
            });
        }

        if (password.length < 6) {
            return res.render('admin/user/userTambah', {
                error: 'Password minimal 6 karakter',
                user: req.session.user
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('admin/user/userTambah', {
                error: 'Email sudah terdaftar',
                user: req.session.user
            });
        }

        // Hash password
        const hashedPassword = await hashHelper.hashPassword(password);

        // Create user
        const newUser = new User({
            nama,
            email,
            password: hashedPassword,
            role,
            status: status || 'Aktif'
        });

        await newUser.save();

        res.redirect('/admin/users?success=User berhasil ditambahkan');
    } catch (error) {
        console.error('Error adding user:', error);
        res.render('admin/user/userTambah', {
            error: 'Gagal menambahkan user',
            user: req.session.user
        });
    }
};

// Show edit user form
exports.showEdit = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.redirect('/admin/users?error=User tidak ditemukan');
        }
        res.render('admin/user/userEdit', { user, currentUser: req.session.user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.redirect('/admin/users?error=Gagal memuat data user');
    }
};

// Update user
exports.edit = async (req, res) => {
    try {
        const { nama, email, newPassword, confirmPassword, role, status } = req.body;
        const userId = req.params.id;

        // Validation
        if (!nama || !email || !role) {
            return res.render('admin/user/userEdit', {
                user: { _id: userId, nama, email, role, status },
                error: 'Nama, email, dan role wajib diisi',
                currentUser: req.session.user
            });
        }

        if (newPassword && newPassword !== confirmPassword) {
            return res.render('admin/user/userEdit', {
                user: { _id: userId, nama, email, role, status },
                error: 'Konfirmasi password tidak cocok',
                currentUser: req.session.user
            });
        }

        if (newPassword && newPassword.length < 6) {
            return res.render('admin/user/userEdit', {
                user: { _id: userId, nama, email, role, status },
                error: 'Password minimal 6 karakter',
                currentUser: req.session.user
            });
        }

        // Check if email already exists (excluding current user)
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.render('admin/user/userEdit', {
                user: { _id: userId, nama, email, role, status },
                error: 'Email sudah terdaftar',
                currentUser: req.session.user
            });
        }

        // Update user data
        const updateData = {
            nama,
            email,
            role,
            status: status || 'Aktif'
        };

        // Hash new password if provided
        if (newPassword) {
            updateData.password = await hashHelper.hashPassword(newPassword);
        }

        await User.findByIdAndUpdate(userId, updateData);

        res.redirect('/admin/users?success=User berhasil diupdate');
    } catch (error) {
        console.error('Error updating user:', error);
        res.render('admin/user/userEdit', {
            user: { _id: req.params.id, ...req.body },
            error: 'Gagal mengupdate user',
            currentUser: req.session.user
        });
    }
};

// Show user detail
exports.detail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.redirect('/admin/users?error=User tidak ditemukan');
        }

        // Get user statistics (placeholder for now)
        const userStats = {
            totalActivities: 0,
            totalAnnouncements: 0
        };

        res.render('admin/user/userDetail', { user, userStats, currentUser: req.session.user });
    } catch (error) {
        console.error('Error fetching user detail:', error);
        res.redirect('/admin/users?error=Gagal memuat detail user');
    }
};

// Delete user
exports.hapus = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Prevent deleting own account
        if (userId === req.session.user.id) {
            return res.redirect('/admin/users?error=Tidak dapat menghapus akun sendiri');
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.redirect('/admin/users?error=User tidak ditemukan');
        }

        res.redirect('/admin/users?success=User berhasil dihapus');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.redirect('/admin/users?error=Gagal menghapus user');
    }
};

// Toggle user status
exports.toggleStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body;

        // Prevent deactivating own account
        if (userId === req.session.user.id && status === 'Nonaktif') {
            return res.json({ success: false, message: 'Tidak dapat menonaktifkan akun sendiri' });
        }

        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
        if (!user) {
            return res.json({ success: false, message: 'User tidak ditemukan' });
        }

        res.json({ success: true, message: `Status user berhasil diubah menjadi ${status}` });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.json({ success: false, message: 'Gagal mengubah status user' });
    }
}; 