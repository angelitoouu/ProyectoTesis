const ESTADOS_INFO = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  listo_prueba: 'Listo para prueba',
  listo_retiro: 'Listo para retiro',
  entregado: 'Entregado',
};

const EstadoBadge = ({ estado }) => {
  const label = ESTADOS_INFO[estado] || estado;
  return (
    <span className={`badge badge-${estado}`}>
      {label}
    </span>
  );
};

export default EstadoBadge;
