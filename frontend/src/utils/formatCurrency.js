/**
 * Formatea un número como moneda chilena (CLP)
 * Ejemplo: 25000 -> "$25.000"
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(num);
};
