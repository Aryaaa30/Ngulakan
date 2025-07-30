const express = require('express');
const router = express.Router();
const strukturController = require('../controllers/strukturController');

router.get('/struktur/list', strukturController.getAll);
router.post('/struktur/tambah', strukturController.create);
router.get('/struktur/edit/:id', strukturController.getById);
router.put('/struktur/edit/:id', strukturController.update);
router.delete('/struktur/hapus/:id', strukturController.delete);

module.exports = router;
