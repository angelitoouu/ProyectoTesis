/**
 * Validaciones para el módulo de Clientes
 */

const validateUpdateCliente = (data) => {
  const { nombre, telefono } = data;

  if (nombre !== undefined && !nombre.trim()) {
    return {
      isValid: false,
      message: 'El nombre del cliente no puede estar vacío.',
    };
  }

  if (telefono !== undefined && !telefono.trim()) {
    return {
      isValid: false,
      message: 'El teléfono del cliente no puede estar vacío.',
    };
  }

  return { isValid: true };
};

module.exports = {
  validateUpdateCliente,
};

