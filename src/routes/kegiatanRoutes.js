const express = require('express');
const router = express.Router();
const kegiatanController = require('../controllers/kegiatanController');

router.get('/kegiatan/list', kegiatanController.getAll);
router.post('/kegiatan/tambah', kegiatanController.create);
router.get('/kegiatan/edit/:id', kegiatanController.getById);
router.put('/kegiatan/edit/:id', kegiatanController.update);
router.delete('/kegiatan/hapus/:id', kegiatanController.delete);

module.exports = router;
