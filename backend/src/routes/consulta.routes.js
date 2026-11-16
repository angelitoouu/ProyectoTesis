const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consulta.controller');

router.get('/', consultaController.consultarEstado);

module.exports = router;
