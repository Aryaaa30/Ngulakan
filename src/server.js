// filepath: /Users/abdullahmaajid/Downloads/polarius./projects/ngulakan/src/server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcrypt');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mainRoutes = require('./routes/mainRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'ngulakan_secret_key_2024',
    resave: false,
    saveUninitialized: false
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('public/login', { error: 'Terjadi kesalahan server.' });
});

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', mainRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});