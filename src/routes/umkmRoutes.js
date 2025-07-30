const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkmController');

router.get('/umkm/list', umkmController.getAll);
router.post('/umkm/tambah', umkmController.create);
router.get('/umkm/edit/:id', umkmController.getById);
router.put('/umkm/edit/:id', umkmController.update);
router.delete('/umkm/hapus/:id', umkmController.delete);

module.exports = router;
