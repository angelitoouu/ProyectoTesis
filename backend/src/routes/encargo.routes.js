const express = require('express');
const router = express.Router();
const encargoController = require('../controllers/encargo.controller');

router.get('/', encargoController.getEncargos);
router.get('/:id', encargoController.getEncargo);
router.post('/', encargoController.createEncargo);
router.patch('/:id/estado', encargoController.updateEstado);
router.put('/:id', encargoController.updateEncargo);
router.delete('/:id', encargoController.deleteEncargo);

module.exports = router;
