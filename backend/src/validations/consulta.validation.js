/**
 * Validaciones para la Consulta Pública
 */

const validateConsulta = (query) => {
  if (!query || !query.trim()) {
    return {
      isValid: false,
      message: 'Debes indicar un teléfono o código de ticket',
    };
  }

  return { isValid: true };
};

module.exports = {
  validateConsulta,
};

