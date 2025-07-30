const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.showPublicDashboard = (req, res) => {
    res.render('public/dashboardPublic');
};

exports.showLogin = (req, res) => {
    res.render('public/login');
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log('Login attempt for username:', username);
        
        // Test database connection first
        await db.query('SELECT 1');
        console.log('Database connection successful');
        
        const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        console.log('Query result:', rows.length, 'rows found');
        
        if (rows.length === 0) {
            console.log('Username not found:', username);
            return res.render('public/login', { error: 'Username tidak ditemukan!' });
        }
        
        const user = rows[0];
        console.log('User found:', user.username);
        
        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match);
        
        if (!match) {
            console.log('Password incorrect for user:', username);
            return res.render('public/login', { error: 'Password salah!' });
        }
        
        req.session.user = { username: user.username, nama: user.nama };
        console.log('Login successful for user:', username);
        res.redirect('/admin/dashboard');
        
    } catch (err) {
        console.error('Login error:', err);
        res.render('public/login', { error: 'Terjadi kesalahan server. Silakan cek koneksi database.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};