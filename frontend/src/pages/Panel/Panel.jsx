import { useEffect, useState } from 'react';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';
import { formatFecha } from '../../utils/formatDate';

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

  const cargarEncargos = async () => {
    try {
      const { data } = await api.get('/encargos');
      setEncargos(data);
    } catch (error) {
      console.error('Error al cargar encargos:', error);
    }
  };

  useEffect(() => {
    cargarEncargos();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/encargos/${id}/estado`, { estado: nuevoEstado });
      cargarEncargos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  return (
    <div className="container">
      <h1>Panel de estados</h1>
      <div className="kanban">
        {ESTADOS.map((col) => (
          <div className="columna" key={col.key}>
            <h3>{col.label}</h3>
            {encargos
              .filter((e) => e.estado === col.key)
              .map((e) => (
                <div className="card" key={e.id}>
                  <strong>{e.prenda}</strong>
                  <div>{e.cliente_nombre}</div>
                  <div>Entrega: {formatFecha(e.fecha_entrega_estimada)}</div>
                  <div>Ticket: {e.codigo_ticket}</div>
                  <EstadoBadge estado={e.estado} />
                  <select value={e.estado} onChange={(ev) => cambiarEstado(e.id, ev.target.value)}>
                    {ESTADOS.map((op) => (
                      <option key={op.key} value={op.key}>{op.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            {encargos.filter((e) => e.estado === col.key).length === 0 && (
              <p style={{ fontSize: '0.85rem', color: '#888' }}>Sin encargos</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Panel;
