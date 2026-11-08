const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'listo_prueba', 'listo_retiro', 'entregado'];

const validarMontos = (precioTotal, abono) => {
  const precio = Number(precioTotal || 0);
  const ab = Number(abono || 0);

  if (isNaN(precio) || precio < 0) {
    throw new Error('El precio total no puede ser negativo');
  }
  if (isNaN(ab) || ab < 0) {
    throw new Error('El abono no puede ser negativo');
  }
  if (ab > precio) {
    throw new Error('El abono no puede ser superior al precio total');
  }
  return true;
};

const calcularSaldo = (precioTotal, abono) => {
  validarMontos(precioTotal, abono);
  return Number(precioTotal) - Number(abono || 0);
};

const validarEstadoTaller = (estado) => {
  return ESTADOS_VALIDOS.includes(estado);
};

const normalizarTelefono = (telefono) => {
  if (!telefono) return '';
  return String(telefono).trim().replace(/\s+/g, '');
};

module.exports = {
  ESTADOS_VALIDOS,
  validarMontos,
  calcularSaldo,
  validarEstadoTaller,
  normalizarTelefono,
};
