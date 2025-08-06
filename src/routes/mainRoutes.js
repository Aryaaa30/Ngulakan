
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Landing page
router.get('/', mainController.dashboard);

// Login form
router.get('/login', mainController.loginForm);

// List berkas
router.get('/berkas/list', mainController.berkasList);

// Detail berkas
router.get('/berkas/detail/:id', mainController.berkasDetail);
router.get('/berkas', (req, res) => {
    res.render('public/berkas/berkasList');
});
router.get('/berkas/lelayu', (req, res) => {
    res.render('public/berkas/lelayu');
});

// Components List
router.get('/components', (req, res) => {
    res.render('public/components/componentsList');
});

// Dynamic component route
router.get('/components/:id', (req, res) => {
    const id = req.params.id;
    if (id >= 1 && id <= 10) {
        res.render(`public/components/component${id}`);
    } else {
        res.status(404).send('Component tidak ditemukan');
    }
});

// Public routes for Pengumuman
router.get('/pengumuman', require('../controllers/pengumumanController').publicList);

// Route agar detail pengumuman bisa diakses dengan /pengumuman/:id
router.get('/pengumuman/:id', require('../controllers/pengumumanController').publicDetail);
router.get('/pengumuman/detail/:id', require('../controllers/pengumumanController').publicDetail);

// Public routes for Kegiatan
router.get('/kegiatan', require('../controllers/kegiatanController').publicList);
router.get('/kegiatan/detail/:id', require('../controllers/kegiatanController').publicDetail);

// Public routes for UMKM
router.get('/umkm', require('../controllers/umkmController').publicList);
router.get('/umkm/detail/:id', require('../controllers/umkmController').publicDetail);

// Public routes for Struktur
router.get('/struktur', require('../controllers/strukturController').publicList);
router.get('/struktur/detail/:id', require('../controllers/strukturController').publicDetail);

module.exports = router;
