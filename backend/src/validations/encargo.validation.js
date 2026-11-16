/**
 * Validaciones para el módulo de Encargos
 * Separa la lógica de validación de los controladores
 */

const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'listo_prueba', 'listo_retiro', 'entregado'];

/**
 * Valida los datos requeridos para la creación de un nuevo encargo
 */
const validateCreateEncargo = (data) => {
  const { nombre_cliente, telefono_cliente, prenda, precio_total, abono } = data;

  if (!nombre_cliente || !telefono_cliente || !prenda) {
    return {
      isValid: false,
      message: 'Faltan campos obligatorios: nombre, teléfono y prenda.',
    };
  }

  const numPrecio = Number(precio_total || 0);
  const numAbono = Number(abono || 0);

  if (isNaN(numPrecio) || numPrecio < 0) {
    return {
      isValid: false,
      message: 'El precio total no puede ser un número negativo.',
    };
  }

  if (isNaN(numAbono) || numAbono < 0) {
    return {
      isValid: false,
      message: 'El abono no puede ser negativo.',
    };
  }

  if (numPrecio > 0 && numAbono > numPrecio) {
    return {
      isValid: false,
      message: 'El abono no puede ser superior al precio total.',
    };
  }

  return { isValid: true };
};

/**
 * Valida que el estado proporcionado pertenezca a los estados permitidos del taller
 */
const validateUpdateEstado = (estado) => {
  if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
    return {
      isValid: false,
      message: 'Estado inválido',
    };
  }

  return { isValid: true };
};

/**
 * Valida los datos para la actualización de un encargo
 */
const validateUpdateEncargo = (data) => {
  const { precio_total, abono, estado } = data;

  if (precio_total !== undefined) {
    const numPrecio = Number(precio_total);
    if (isNaN(numPrecio) || numPrecio < 0) {
      return {
        isValid: false,
        message: 'El precio total no puede ser un número negativo.',
      };
    }
  }

  if (abono !== undefined) {
    const numAbono = Number(abono);
    if (isNaN(numAbono) || numAbono < 0) {
      return {
        isValid: false,
        message: 'El abono no puede ser negativo.',
      };
    }
  }

  if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
    return {
      isValid: false,
      message: 'Estado inválido',
    };
  }

  return { isValid: true };
};

module.exports = {
  validateCreateEncargo,
  validateUpdateEstado,
  validateUpdateEncargo,
  ESTADOS_VALIDOS,
};

