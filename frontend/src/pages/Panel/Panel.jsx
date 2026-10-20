import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';
import { formatFecha } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

// Objetivo específico 2: panel con cambio de estados, ordenado por fecha de entrega
const ESTADOS = [
  { key: 'pendiente', label: 'Pendiente', color: 'var(--accent-amber)' },
  { key: 'en_proceso', label: 'En proceso', color: 'var(--accent-cyan)' },
  { key: 'listo_prueba', label: 'Listo para prueba', color: 'var(--accent-purple)' },
  { key: 'listo_retiro', label: 'Listo para retiro', color: 'var(--accent-emerald)' },
  { key: 'entregado', label: 'Entregado', color: 'var(--primary)' },
];

const Panel = () => {
  const [encargos, setEncargos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Modal para eliminar
  const [encargoAEliminar, setEncargoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  // Modal para aceptar y fijar fecha/presupuesto
  const [encargoAEditar, setEncargoAEditar] = useState(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [formEdicion, setFormEdicion] = useState({
    fecha_entrega_estimada: '',
    precio_total: '',
    abono: '',
    estado: '',
  });

  const cargarEncargos = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/encargos');
      setEncargos(data);
    } catch (error) {
      console.error('Error al cargar encargos:', error);
      setMensaje({
        tipo: 'error',
        texto: 'No se pudo conectar con el servidor para cargar los encargos.',
      });
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
      setMensaje({ tipo: 'success', texto: `Estado actualizado a "${nuevoEstado.replace('_', ' ')}".` });
      setTimeout(() => setMensaje(null), 3000);
      cargarEncargos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setMensaje({ tipo: 'error', texto: 'Error al actualizar el estado del encargo.' });
    }
  };

  const solicitarEliminar = (encargo, ev) => {
    if (ev) {
      ev.stopPropagation();
      ev.preventDefault();
    }
    setEncargoAEliminar(encargo);
  };

  const confirmarEliminar = async () => {
    if (!encargoAEliminar) return;
    try {
      setEliminando(true);
      await api.delete(`/encargos/${encargoAEliminar.id}`);
      setMensaje({ tipo: 'success', texto: `Encargo ${encargoAEliminar.codigo_ticket} eliminado exitosamente.` });
      setTimeout(() => setMensaje(null), 3000);
      setEncargoAEliminar(null);
      cargarEncargos();
    } catch (error) {
      console.error('Error al eliminar encargo:', error);
      setMensaje({ tipo: 'error', texto: 'No se pudo eliminar el encargo del servidor.' });
    } finally {
      setEliminando(false);
    }
  };

  const abrirModalAceptar = (encargo, ev) => {
    if (ev) {
      ev.stopPropagation();
      ev.preventDefault();
    }
    setEncargoAEditar(encargo);
    setFormEdicion({
      fecha_entrega_estimada: encargo.fecha_entrega_estimada ? encargo.fecha_entrega_estimada.split('T')[0] : '',
      precio_total: Number(encargo.precio_total) > 0 ? Number(encargo.precio_total) : '',
      abono: Number(encargo.abono) > 0 ? Number(encargo.abono) : '',
      estado: encargo.estado === 'pendiente' ? 'en_proceso' : encargo.estado,
    });
  };

  const fijarDias = (dias) => {
    const d = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setFormEdicion((prev) => ({ ...prev, fecha_entrega_estimada: d }));
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!encargoAEditar) return;
    try {
      setGuardandoEdicion(true);
      await api.put(`/encargos/${encargoAEditar.id}`, {
        fecha_entrega_estimada: formEdicion.fecha_entrega_estimada,
        precio_total: Number(formEdicion.precio_total) || 0,
        abono: Number(formEdicion.abono) || 0,
        estado: formEdicion.estado,
      });
      setMensaje({
        tipo: 'success',
        texto: `Pedido ${encargoAEditar.codigo_ticket} aceptado. Fecha estimada de entrega asignada: ${formatFecha(formEdicion.fecha_entrega_estimada)}.`,
      });
      setTimeout(() => setMensaje(null), 3500);
      setEncargoAEditar(null);
      cargarEncargos();
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      setMensaje({ tipo: 'error', texto: 'No se pudo guardar la actualización del pedido.' });
    } finally {
      setGuardandoEdicion(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Panel de Control de Estados</h1>
          <p>Supervisa el flujo de trabajo del taller ordenado por fecha de entrega estimada.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button type="button" className="btn btn-secondary" onClick={cargarEncargos} disabled={cargando}>
            {cargando ? 'Actualizando...' : 'Recargar Tablero'}
          </button>
          <Link to="/nuevo" className="btn">
            Nuevo Encargo en Taller
          </Link>
        </div>
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
                const esPendiente = e.estado === 'pendiente';
                const precio = Number(e.precio_total) || 0;
                const abono = Number(e.abono) || 0;
                const saldo = Math.max(0, precio - abono);
                const pendientePresupuesto = precio === 0;

                return (
                  <div className="kanban-card" key={e.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <div>
                        <span className="kanban-card-title">{e.prenda}</span>
                        {esPendiente && (
                          <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.3rem' }}>
                            Nueva Solicitud
                          </span>
                        )}
                      </div>
                      <span className="ticket-tag">{e.codigo_ticket}</span>
                    </div>

                    <div className="kanban-card-meta">
                      <span>Cliente: <strong>{e.cliente_nombre}</strong></span>
                      <span>
                        Entrega estimada:{' '}
                        {e.fecha_entrega_estimada ? (
                          <strong>{formatFecha(e.fecha_entrega_estimada)}</strong>
                        ) : (
                          <strong style={{ color: 'var(--accent-amber)' }}>Por coordinar</strong>
                        )}
                      </span>
                      
                      {pendientePresupuesto ? (
                        <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.84rem' }}>
                          Presupuesto: Pendiente de cotizar
                        </span>
                      ) : (
                        <>
                          <span>Total: <strong>{formatCurrency(precio)}</strong></span>
                          <span>
                            Saldo:{' '}
                            <strong style={{ color: saldo > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                              {formatCurrency(saldo)}
                            </strong>
                          </span>
                        </>
                      )}

                      {e.descripcion_trabajo && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                          "{e.descripcion_trabajo}"
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: '0.2rem' }}>
                      <EstadoBadge estado={e.estado} />
                    </div>

                    {/* Botón para aceptar el pedido y fijar fecha/presupuesto */}
                    <button
                      type="button"
                      onClick={(ev) => abrirModalAceptar(e, ev)}
                      className="btn"
                      style={{
                        padding: '0.4rem 0.65rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        width: '100%',
                        justifyContent: 'center',
                        background: esPendiente ? 'var(--primary)' : 'white',
                        color: esPendiente ? '#ffffff' : 'var(--text-main)',
                        borderColor: esPendiente ? 'var(--primary)' : 'var(--border)',
                        boxShadow: esPendiente ? '0 2px 4px rgba(79, 70, 229, 0.25)' : 'none',
                      }}
                    >
                      {esPendiente ? 'Aceptar Pedido y Dar Fecha' : 'Modificar Fecha / Presupuesto'}
                    </button>

                    <div className="kanban-card-actions">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor={`estado-${e.id}`}>Mover etapa:</label>
                        <button
                          type="button"
                          onClick={(ev) => solicitarEliminar(e, ev)}
                          style={{
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: 'none',
                          }}
                          title="Eliminar encargo"
                        >
                          Eliminar
                        </button>
                      </div>
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

      {/* Modal para aceptar pedido y fijar fecha y presupuesto */}
      {encargoAEditar && (
        <div className="modal-backdrop" onClick={() => !guardandoEdicion && setEncargoAEditar(null)}>
          <div className="modal-card" onClick={(ev) => ev.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', color: 'var(--text-main)', fontWeight: 800 }}>
              {encargoAEditar.estado === 'pendiente' ? 'Aceptar Pedido y Asignar Fecha' : 'Modificar Fecha y Presupuesto'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              {encargoAEditar.estado === 'pendiente'
                ? 'Revisa la solicitud del cliente, fija la fecha aproximada de entrega y el presupuesto para pasar el pedido a producción.'
                : 'Actualiza los compromisos de entrega y pagos para este encargo.'}
            </p>

            {/* Resumen del encargo y cliente */}
            <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', marginBottom: '1rem', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Cliente: <strong>{encargoAEditar.cliente_nombre}</strong></span>
                <span>Tel: <strong>{encargoAEditar.cliente_telefono}</strong></span>
              </div>
              <div>
                Prenda: <strong>{encargoAEditar.prenda}</strong> | Ticket: <span className="ticket-tag">{encargoAEditar.codigo_ticket}</span>
              </div>
              {encargoAEditar.descripcion_trabajo && (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.1rem', background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  "{encargoAEditar.descripcion_trabajo}"
                </div>
              )}
            </div>

            <form onSubmit={guardarEdicion} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="form-group">
                <label htmlFor="modal_fecha">Fecha Aproximada en que Estará Listo *</label>
                <input
                  id="modal_fecha"
                  type="date"
                  value={formEdicion.fecha_entrega_estimada}
                  onChange={(ev) => setFormEdicion({ ...formEdicion, fecha_entrega_estimada: ev.target.value })}
                  required
                />
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Sugerir plazo:</span>
                  <button
                    type="button"
                    onClick={() => fijarDias(3)}
                    style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    +3 días
                  </button>
                  <button
                    type="button"
                    onClick={() => fijarDias(5)}
                    style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    +5 días
                  </button>
                  <button
                    type="button"
                    onClick={() => fijarDias(7)}
                    style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    +1 semana
                  </button>
                  <button
                    type="button"
                    onClick={() => fijarDias(14)}
                    style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    +2 semanas
                  </button>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="modal_precio">Precio Total ($)</label>
                  <input
                    id="modal_precio"
                    type="number"
                    min="0"
                    placeholder="Ej. 15000"
                    value={formEdicion.precio_total}
                    onChange={(ev) => setFormEdicion({ ...formEdicion, precio_total: ev.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modal_abono">Abono Inicial ($)</label>
                  <input
                    id="modal_abono"
                    type="number"
                    min="0"
                    placeholder="Ej. 5000"
                    value={formEdicion.abono}
                    onChange={(ev) => setFormEdicion({ ...formEdicion, abono: ev.target.value })}
                  />
                </div>
              </div>

              {Number(formEdicion.precio_total) > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--surface-alt)', padding: '0.5rem 0.8rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Saldo a cobrar al cliente:</span>
                  <strong style={{ color: 'var(--primary)' }}>
                    {formatCurrency(Math.max(0, (Number(formEdicion.precio_total) || 0) - (Number(formEdicion.abono) || 0)))}
                  </strong>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="modal_estado">Estado del Pedido</label>
                <select
                  id="modal_estado"
                  value={formEdicion.estado}
                  onChange={(ev) => setFormEdicion({ ...formEdicion, estado: ev.target.value })}
                >
                  {ESTADOS.map((op) => (
                    <option key={op.key} value={op.key}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.8rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEncargoAEditar(null)}
                  disabled={guardandoEdicion}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={guardandoEdicion}
                >
                  {guardandoEdicion
                    ? 'Guardando...'
                    : encargoAEditar.estado === 'pendiente'
                    ? 'Aceptar Pedido y Fijar Fecha'
                    : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal interactivo de confirmación de eliminación */}
      {encargoAEliminar && (
        <div className="modal-backdrop" onClick={() => !eliminando && setEncargoAEliminar(null)}>
          <div className="modal-card" onClick={(ev) => ev.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem', color: 'var(--text-main)', fontWeight: 800 }}>
              ¿Eliminar encargo?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', marginBottom: '1.4rem', lineHeight: 1.5 }}>
              ¿Estás seguro de que deseas eliminar permanentemente <strong>"{encargoAEliminar.prenda}"</strong> (Ticket: <span className="ticket-tag">{encargoAEliminar.codigo_ticket}</span>) correspondiente al cliente <strong>{encargoAEliminar.cliente_nombre}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEncargoAEliminar(null)}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmarEliminar}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panel;
