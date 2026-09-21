const express = require('express');
const router = express.Router();

const clienteRoutes = require('./cliente.routes');
const encargoRoutes = require('./encargo.routes');
const consultaRoutes = require('./consulta.routes');

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'taller-costura-api'
  });
});

router.use('/clientes', clienteRoutes);
router.use('/encargos', encargoRoutes);
router.use('/consulta', consultaRoutes);

module.exports = router;

