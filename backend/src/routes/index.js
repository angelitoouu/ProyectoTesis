const express = require('express');
const router = express.Router();

const clienteRoutes = require('./cliente.routes');
const encargoRoutes = require('./encargo.routes');
const consultaRoutes = require('./consulta.routes');

router.use('/clientes', clienteRoutes);
router.use('/encargos', encargoRoutes);
router.use('/consulta', consultaRoutes);

module.exports = router;
