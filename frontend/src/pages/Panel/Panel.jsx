import { useEffect, useState } from 'react';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';
import { formatFecha } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

// Objetivo específico 2: panel con cambio de estados, ordenado por fecha de entrega
const ESTADOS = [
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'en_proceso', label: 'En proceso' },
  { key: 'listo_prueba', label: 'Listo para prueba' },
  { key: 'listo_retiro', label: 'Listo para retiro' },
  { key: 'entregado', label: 'Entregado' },
];

const Panel = () => {
  const [encargos, setEncargos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const cargarEncargos = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/encargos');
      setEncargos(data);
    } catch (error) {
      console.error('Error al cargar encargos:', error);
      setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servidor para cargar los encargos.' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEncargos();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/encargos/${id}/estado`, { estado: nuevoEstado });
      setMensaje({ tipo: 'success', texto: `Estado actualizado a "${nuevoEstado.replace('_', ' ')}"` });
      setTimeout(() => setMensaje(null), 3000);
      cargarEncargos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setMensaje({ tipo: 'error', texto: 'Error al actualizar el estado del encargo.' });
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Panel de Control de Estados</h1>
          <p>Supervisa el flujo de trabajo del taller ordenado por fecha de entrega estimada.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={cargarEncargos} disabled={cargando}>
          {cargando ? 'Actualizando...' : 'Recargar Tablero'}
        </button>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`}>
          <div>{mensaje.texto}</div>
        </div>
      )}

      <div className="kanban-board">
        {ESTADOS.map((col) => {
          const encargosColumna = encargos.filter((e) => e.estado === col.key);
          return (
            <div className="kanban-column" key={col.key}>
              <div className="kanban-column-header">
                <h3>{col.label}</h3>
                <span className="count-pill">{encargosColumna.length}</span>
              </div>

              {encargosColumna.map((e) => {
                const saldo = Math.max(0, Number(e.precio_total) - Number(e.abono || 0));
                return (
                  <div className="kanban-card" key={e.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span className="kanban-card-title">{e.prenda}</span>
                      <span className="ticket-tag">{e.codigo_ticket}</span>
                    </div>

                    <div className="kanban-card-meta">
                      <span>Cliente: <strong>{e.cliente_nombre}</strong></span>
                      <span>Entrega: <strong>{formatFecha(e.fecha_entrega_estimada)}</strong></span>
                      <span>Saldo: <strong>{formatCurrency(saldo)}</strong></span>
                      {e.descripcion_trabajo && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                          "{e.descripcion_trabajo}"
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: '0.2rem' }}>
                      <EstadoBadge estado={e.estado} />
                    </div>

                    <div className="kanban-card-actions">
                      <label htmlFor={`estado-${e.id}`}>Mover a:</label>
                      <select
                        id={`estado-${e.id}`}
                        value={e.estado}
                        onChange={(ev) => cambiarEstado(e.id, ev.target.value)}
                      >
                        {ESTADOS.map((op) => (
                          <option key={op.key} value={op.key}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}

              {encargosColumna.length === 0 && (
                <div className="empty-column">Sin encargos en esta etapa</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Panel;
