// src/routes/mainRouter.js
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
router.get('/berkas/pengantar', (req, res) => {
    res.render('public/berkas/pengantar');
});

module.exports = router;
