const express = require('express');
const router = express.Router();
const pengumumanController = require('../controllers/pengumumanController');

router.get('/pengumuman/list', pengumumanController.getAll);
router.post('/pengumuman/tambah', pengumumanController.create);
router.get('/pengumuman/edit/:id', pengumumanController.getById);
router.put('/pengumuman/edit/:id', pengumumanController.update);
router.delete('/pengumuman/hapus/:id', pengumumanController.delete);

module.exports = router;
