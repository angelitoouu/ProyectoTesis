import { useEffect, useState } from 'react';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';
import { formatFecha } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const getIniciales = (nombre) => {
  if (!nombre) return 'C';
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
};

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [cargandoFicha, setCargandoFicha] = useState(false);

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
      setCargandoFicha(true);
      const { data } = await api.get(`/clientes/${id}`);
      setSeleccionado(data);
      // Desplazamiento suave hacia la ficha
      setTimeout(() => {
        const elemento = document.getElementById('ficha-cliente-detalle');
        if (elemento) {
          elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error al cargar historial del cliente:', error);
    } finally {
      setCargandoFicha(false);
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
        <h1>Fichas de Clientes</h1>
        <p>Directorio de clientes del taller con historial de prendas confeccionadas y cuaderno de medidas corporales.</p>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          style={{ maxWidth: '420px', background: '#ffffff' }}
          type="text"
          placeholder="Buscar por nombre, teléfono o dirección..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {clientesFiltrados.length} cliente(s) en lista
        </span>
      </div>

      {cargando && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Cargando directorio de clientes...
        </div>
      )}

      {!cargando && clientesFiltrados.length === 0 && (
        <div className="empty-column" style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          No se encontraron clientes registrados con ese criterio de búsqueda.
        </div>
      )}

      {/* Grid cálido de tarjetas de clientes */}
      <div className="clients-grid">
        {clientesFiltrados.map((c) => {
          const estaSeleccionado = seleccionado && seleccionado.id === c.id;
          return (
            <div
              className={`client-card ${estaSeleccionado ? 'active' : ''}`}
              key={c.id}
              onClick={() => verHistorial(c.id)}
            >
              <div className="client-card-header">
                <div className="client-avatar">
                  {getIniciales(c.nombre)}
                </div>
                <div className="client-card-info">
                  <h3>{c.nombre}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                    Cliente del Taller
                  </span>
                </div>
              </div>

              <div className="client-card-meta">
                <div className="client-meta-row">
                  <span className="client-meta-label">Teléfono:</span>
                  <span>{c.telefono}</span>
                </div>
                <div className="client-meta-row">
                  <span className="client-meta-label">Dirección:</span>
                  <span>{c.direccion || <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Sin dirección</span>}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
                <button
                  type="button"
                  className={estaSeleccionado ? 'btn' : 'btn btn-secondary'}
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.84rem' }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    verHistorial(c.id);
                  }}
                >
                  {estaSeleccionado ? 'Ficha abierta' : 'Ver ficha y medidas'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ficha Detallada del Cliente Seleccionado */}
      {seleccionado && (
        <div id="ficha-cliente-detalle" className="consult-result-card" style={{ marginTop: '1rem', borderTop: '4px solid var(--primary)' }}>
          <div className="consult-result-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="client-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                {getIniciales(seleccionado.nombre)}
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>
                  Ficha Histórica del Cliente
                </span>
                <h2 className="consult-result-title" style={{ marginTop: '0.1rem' }}>{seleccionado.nombre}</h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <div>Teléfono: <strong style={{ color: 'var(--text-main)' }}>{seleccionado.telefono}</strong></div>
                <div>Dirección: <strong style={{ color: 'var(--text-main)' }}>{seleccionado.direccion || 'Sin dirección registrada'}</strong></div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                onClick={() => setSeleccionado(null)}
              >
                Cerrar ficha
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas del cliente */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Prendas Encargadas</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {seleccionado.encargos?.length || 0}
              </div>
            </div>

            <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total en Trabajos</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                {formatCurrency(
                  seleccionado.encargos?.reduce((acc, e) => acc + Number(e.precio_total || 0), 0) || 0
                )}
              </div>
            </div>

            <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Saldo Pendiente Actual</span>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  marginTop: '0.2rem',
                  color: (seleccionado.encargos?.reduce((acc, e) => acc + Math.max(0, Number(e.precio_total) - Number(e.abono || 0)), 0) || 0) > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                }}
              >
                {formatCurrency(
                  seleccionado.encargos?.reduce((acc, e) => acc + Math.max(0, Number(e.precio_total) - Number(e.abono || 0)), 0) || 0
                )}
              </div>
            </div>
          </div>

          {/* Cuaderno de medidas del cliente */}
          <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1.2rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.6rem', fontSize: '1rem', fontWeight: 800 }}>
              Cuaderno de Medidas Registradas
            </h4>
            {seleccionado.encargos && seleccionado.encargos.some((e) => e.medidas && Object.keys(e.medidas).length > 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {seleccionado.encargos
                  .filter((e) => e.medidas && Object.keys(e.medidas).length > 0)
                  .map((e) => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '150px' }}>
                        {e.prenda} ({e.codigo_ticket}):
                      </span>
                      {renderMedidas(e.medidas)}
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                Este cliente no cuenta con medidas corporales registradas en sus prendas.
              </p>
            )}
          </div>

          {/* Historial detallado de prendas */}
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.9rem', fontSize: '1.05rem', fontWeight: 800 }}>
              Historial de Prendas y Trabajos ({seleccionado.encargos?.length || 0})
            </h4>

            {(!seleccionado.encargos || seleccionado.encargos.length === 0) && (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
                Este cliente aún no tiene encargos registrados.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {seleccionado.encargos?.map((e) => {
                const saldo = Math.max(0, Number(e.precio_total) - Number(e.abono || 0));
                return (
                  <div className="kanban-card" key={e.id} style={{ background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{e.prenda}</strong>
                        <span className="ticket-tag" style={{ marginLeft: '0.6rem' }}>{e.codigo_ticket}</span>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontStyle: e.descripcion_trabajo ? 'normal' : 'italic' }}>
                          {e.descripcion_trabajo || 'Sin detalle de trabajo'}
                        </p>
                      </div>
                      <EstadoBadge estado={e.estado} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span>Fecha estimada: <strong style={{ color: 'var(--text-main)' }}>{formatFecha(e.fecha_entrega_estimada)}</strong></span>
                      <span>Total: <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(e.precio_total)}</strong></span>
                      <span>Abonado: <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(e.abono)}</strong></span>
                      <span>
                        Saldo:{' '}
                        <strong style={{ color: saldo > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                          {formatCurrency(saldo)}
                        </strong>
                      </span>
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
