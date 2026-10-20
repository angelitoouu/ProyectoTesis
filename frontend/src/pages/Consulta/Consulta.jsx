import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';
import { formatFecha } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

// Objetivo específico 4: vista pública de consulta por teléfono o código de ticket
const Consulta = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError(null);
    setResultados(null);
    setCargando(true);

    try {
      const { data } = await api.get('/consulta', { params: { query: query.trim() } });
      if (data.length === 0) {
        setError('No encontramos encargos asociados a ese número o código. Revisa que esté bien escrito.');
      } else {
        setResultados(data);
      }
    } catch (err) {
      setError('No encontramos encargos con ese dato o hubo un problema al consultar el servidor.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '820px' }}>
      <div className="page-header" style={{ textAlign: 'center', marginTop: '1rem' }}>
        <h1 style={{ marginTop: '0.5rem' }}>Consulta el Estado de tu Prenda</h1>
        <p>Ingresa tu número telefónico de contacto o el código de ticket para ver en qué etapa va tu encargo.</p>
        <div style={{ marginTop: '0.9rem' }}>
          <Link to="/solicitar" className="btn btn-secondary" style={{ fontSize: '0.86rem', padding: '0.45rem 1rem' }}>
            ¿Necesitas confeccionar o arreglar una prenda? Solicita tu encargo aquí
          </Link>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleBuscar} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div className="form-group">
            <label htmlFor="query">Teléfono o Código de Ticket</label>
            <input
              id="query"
              placeholder="Ej. +56911111111 o TK-1234"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <span className="hint">Puedes buscar usando tu número de teléfono o tu código de ticket.</span>
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Buscando encargo...' : 'Consultar Estado'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '600px', margin: '1.5rem auto 0' }}>
          <div>{error}</div>
        </div>
      )}

      {resultados && resultados.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 800 }}>
            Encargos encontrados ({resultados.length}):
          </h3>

          {resultados.map((r) => {
            const precio = Number(r.precio_total) || 0;
            const abono = Number(r.abono) || 0;
            const saldo = Math.max(0, precio - abono);
            const pendienteAceptacion = r.estado === 'pendiente' || !r.fecha_entrega_estimada;
            const pendientePresupuesto = precio === 0;

            return (
              <div className="consult-result-card" key={r.codigo_ticket}>
                <div className="consult-result-header">
                  <div>
                    <span className="ticket-tag">{r.codigo_ticket}</span>
                    <h2 className="consult-result-title" style={{ marginTop: '0.3rem' }}>{r.prenda}</h2>
                  </div>
                  <EstadoBadge estado={r.estado} />
                </div>

                {r.descripcion_trabajo && (
                  <div style={{ marginTop: '0.4rem', marginBottom: '0.8rem', padding: '0.6rem 0.8rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.2rem' }}>
                      Trabajo Solicitado
                    </span>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                      "{r.descripcion_trabajo}"
                    </p>
                  </div>
                )}

                <div className="consult-detail-grid">
                  <div className="consult-detail-item">
                    <span className="caption">Cliente</span>
                    <span className="val">{r.cliente_nombre}</span>
                  </div>
                  <div className="consult-detail-item">
                    <span className="caption">Fecha Estimada de Entrega</span>
                    <span className="val" style={{ color: !r.fecha_entrega_estimada ? 'var(--accent-amber)' : 'inherit', fontWeight: 700 }}>
                      {r.fecha_entrega_estimada ? formatFecha(r.fecha_entrega_estimada) : 'Pendiente de fecha por la encargada'}
                    </span>
                  </div>
                  <div className="consult-detail-item">
                    <span className="caption">Precio Total</span>
                    <span className="val" style={{ color: pendientePresupuesto ? 'var(--accent-amber)' : 'inherit' }}>
                      {pendientePresupuesto ? 'Por cotizar en taller' : formatCurrency(precio)}
                    </span>
                  </div>
                  <div className="consult-detail-item">
                    <span className="caption">Abonado</span>
                    <span className="val">{formatCurrency(abono)}</span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: pendienteAceptacion
                      ? '#eff6ff'
                      : saldo > 0
                      ? 'var(--warning-bg)'
                      : 'var(--success-bg)',
                    border: `1.5px solid ${
                      pendienteAceptacion
                        ? '#bfdbfe'
                        : saldo > 0
                        ? 'var(--warning-border)'
                        : 'var(--success-border)'
                    }`,
                    color: pendienteAceptacion
                      ? '#1e40af'
                      : saldo > 0
                      ? 'var(--warning-text)'
                      : 'var(--success-text)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.8rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {pendienteAceptacion
                      ? 'Solicitud recibida. La encargada del taller revisará tu pedido para aceptarlo y asignarle la fecha aproximada de entrega.'
                      : saldo > 0
                      ? 'Saldo a cancelar al retirar la prenda:'
                      : 'Prenda completamente pagada'}
                  </span>
                  {!pendientePresupuesto && (
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(saldo)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Consulta;
