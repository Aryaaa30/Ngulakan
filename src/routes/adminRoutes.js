const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const kegiatanController = require('../controllers/kegiatanController');
const pengumumanController = require('../controllers/pengumumanController');
const strukturController = require('../controllers/strukturController');
const umkmController = require('../controllers/umkmController');
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Dashboard
router.get('/dashboard', ensureAuthenticated, adminController.dashboard);

// User Management CRUD
router.get('/users', ensureAuthenticated, userController.list);
router.get('/users/tambah', ensureAuthenticated, userController.showTambah);
router.post('/users/tambah', ensureAuthenticated, userController.tambah);
router.get('/users/edit/:id', ensureAuthenticated, userController.showEdit);
router.post('/users/edit/:id', ensureAuthenticated, userController.edit);
router.post('/users/hapus/:id', ensureAuthenticated, userController.hapus);
router.get('/users/:id', ensureAuthenticated, userController.detail);
router.post('/users/toggle-status/:id', ensureAuthenticated, userController.toggleStatus);

// Kegiatan Management CRUD
router.get('/kegiatan', ensureAuthenticated, kegiatanController.list);
router.get('/kegiatan/tambah', ensureAuthenticated, kegiatanController.showTambah);
router.post('/kegiatan/tambah', ensureAuthenticated, kegiatanController.tambah);
router.get('/kegiatan/edit/:id', ensureAuthenticated, kegiatanController.showEdit);
router.post('/kegiatan/edit/:id', ensureAuthenticated, kegiatanController.edit);
router.post('/kegiatan/hapus/:id', ensureAuthenticated, kegiatanController.hapus);
router.get('/kegiatan/:id', ensureAuthenticated, kegiatanController.detail);

// Pengumuman Management CRUD
router.get('/pengumuman', ensureAuthenticated, pengumumanController.list);
router.get('/pengumuman/tambah', ensureAuthenticated, pengumumanController.showTambah);
router.post('/pengumuman/tambah', ensureAuthenticated, pengumumanController.tambah);
router.get('/pengumuman/edit/:id', ensureAuthenticated, pengumumanController.showEdit);
router.post('/pengumuman/edit/:id', ensureAuthenticated, pengumumanController.edit);
router.post('/pengumuman/hapus/:id', ensureAuthenticated, pengumumanController.hapus);
router.get('/pengumuman/:id', ensureAuthenticated, pengumumanController.detail);
router.post('/pengumuman/toggle-status/:id', ensureAuthenticated, pengumumanController.toggleStatus);

// Struktur Management CRUD
router.get('/struktur', ensureAuthenticated, strukturController.list);
router.get('/struktur/tambah', ensureAuthenticated, strukturController.showTambah);
router.post('/struktur/tambah', ensureAuthenticated, strukturController.uploadMiddleware, strukturController.tambah);
router.get('/struktur/detail/:id', ensureAuthenticated, strukturController.detail);
router.get('/struktur/edit/:id', ensureAuthenticated, strukturController.showEdit);
router.post('/struktur/edit/:id', ensureAuthenticated, strukturController.uploadMiddleware, strukturController.edit);
router.post('/struktur/hapus/:id', ensureAuthenticated, strukturController.hapus);

// UMKM Management CRUD
router.get('/umkm', ensureAuthenticated, umkmController.list);
router.get('/umkm/tambah', ensureAuthenticated, umkmController.showTambah);
router.post('/umkm/tambah', ensureAuthenticated, umkmController.uploadMiddleware, umkmController.tambah);
router.get('/umkm/detail/:id', ensureAuthenticated, umkmController.detail);
router.get('/umkm/edit/:id', ensureAuthenticated, umkmController.showEdit);
router.post('/umkm/edit/:id', ensureAuthenticated, umkmController.uploadMiddleware, umkmController.edit);
router.post('/umkm/hapus/:id', ensureAuthenticated, umkmController.hapus);

module.exports = router;