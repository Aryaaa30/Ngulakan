
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

module.exports = router;
