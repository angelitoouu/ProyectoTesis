import { useEffect, useState } from 'react';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';
import { formatFecha } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

// Objetivo específico 3: historial de clientes con medidas y trabajos anteriores
const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/clientes');
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setCargando(false);
    }
  };

  const verHistorial = async (id) => {
    try {
      const { data } = await api.get(`/clientes/${id}`);
      setSeleccionado(data);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (error) {
      console.error('Error al cargar historial del cliente:', error);
    }
  };

  const renderMedidas = (medidas) => {
    if (!medidas || Object.keys(medidas).length === 0) {
      return <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>No registradas</span>;
    }
    return (
      <div className="measure-chips">
        {Object.entries(medidas).map(([clave, valor]) => (
          <span className="measure-chip" key={clave}>
            {clave.charAt(0).toUpperCase() + clave.slice(1)}: <span>{valor} cm</span>
          </span>
        ))}
      </div>
    );
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      c.telefono.includes(filtro) ||
      (c.direccion && c.direccion.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Historial de Clientes</h1>
        <p>Base de datos de clientes recurrentes, historial de medidas corporales y encargos anteriores.</p>
      </div>

      <div style={{ marginBottom: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          style={{ maxWidth: '380px' }}
          type="text"
          placeholder="Buscar por nombre, teléfono o dirección..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {clientesFiltrados.length} cliente(s) encontrado(s)
        </span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre del Cliente</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.nombre}</strong>
                </td>
                <td>{c.telefono}</td>
                <td>{c.direccion || <span style={{ color: 'var(--text-light)' }}>-</span>}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    onClick={() => verHistorial(c.id)}
                  >
                    Ver historial y medidas
                  </button>
                </td>
              </tr>
            ))}
            {clientesFiltrados.length === 0 && !cargando && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                  No se encontraron clientes registrados con ese criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {seleccionado && (
        <div className="consult-result-card" style={{ marginTop: '2rem' }}>
          <div className="consult-result-header">
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                Ficha Histórica del Cliente
              </span>
              <h2 className="consult-result-title">{seleccionado.nombre}</h2>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div>Teléfono: {seleccionado.telefono}</div>
              <div>Dirección: {seleccionado.direccion || 'Sin dirección registrada'}</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.05rem' }}>
              Historial de Trabajos ({seleccionado.encargos?.length || 0})
            </h4>

            {(!seleccionado.encargos || seleccionado.encargos.length === 0) && (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
                Este cliente no tiene encargos finalizados o en curso.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {seleccionado.encargos?.map((e) => {
                const saldo = Math.max(0, Number(e.precio_total) - Number(e.abono || 0));
                return (
                  <div className="kanban-card" key={e.id} style={{ background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{e.prenda}</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                          {e.descripcion_trabajo || 'Sin notas especiales'}
                        </p>
                      </div>
                      <EstadoBadge estado={e.estado} />
                    </div>

                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Medidas tomadas:
                      </span>
                      {renderMedidas(e.medidas)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.4rem' }}>
                      <span>Entrega estimada: <strong>{formatFecha(e.fecha_entrega_estimada)}</strong></span>
                      <span>Ticket: <strong className="ticket-tag">{e.codigo_ticket}</strong></span>
                      <span>Total: <strong>{formatCurrency(e.precio_total)}</strong></span>
                      <span>Saldo: <strong style={{ color: saldo > 0 ? 'var(--accent)' : 'inherit' }}>{formatCurrency(saldo)}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
