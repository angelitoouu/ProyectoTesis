const encargoValidation = require('./encargo.validation');
const clienteValidation = require('./cliente.validation');
const consultaValidation = require('./consulta.validation');

module.exports = {
  ...encargoValidation,
  ...clienteValidation,
  ...consultaValidation,
};

