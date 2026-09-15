const colores = {
  pendiente: '#b45309',
  en_proceso: '#1d4ed8',
  listo_prueba: '#7c3aed',
  listo_retiro: '#059669',
  entregado: '#4b5563',
};

const etiquetas = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  listo_prueba: 'Listo para prueba',
  listo_retiro: 'Listo para retiro',
  entregado: 'Entregado',
};

const EstadoBadge = ({ estado }) => (
  <span className="badge" style={{ backgroundColor: colores[estado] || '#999' }}>
    {etiquetas[estado] || estado}
  </span>
);

export default EstadoBadge;
