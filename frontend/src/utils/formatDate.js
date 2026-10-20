export const formatFecha = (fecha, fallback = 'Por confirmar') => {
  if (!fecha) return fallback;
  const str = typeof fecha === 'string' ? fecha : new Date(fecha).toISOString();
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match;
    return `${d}/${m}/${y}`;
  }
  return new Date(fecha).toLocaleDateString('es-CL');
};
