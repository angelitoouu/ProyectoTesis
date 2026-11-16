const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

router.get('/', clienteController.getClientes);
router.get('/:id', clienteController.getCliente);
router.put('/:id', clienteController.updateCliente);

module.exports = router;
