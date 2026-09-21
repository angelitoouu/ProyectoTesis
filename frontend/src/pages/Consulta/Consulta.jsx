import { useState } from 'react';
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
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ textAlign: 'center', marginTop: '1rem' }}>
        <h1 style={{ marginTop: '0.5rem' }}>Consulta el Estado de tu Prenda</h1>
        <p>Ingresa tu número telefónico de contacto o el código de ticket para ver en qué etapa va tu encargo.</p>
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
            <span className="hint">Puedes buscar usando cualquiera de los dos datos.</span>
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
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
            Encargos encontrados ({resultados.length}):
          </h3>

          {resultados.map((r) => {
            const saldo = Number(r.saldo) || 0;
            return (
              <div className="consult-result-card" key={r.codigo_ticket}>
                <div className="consult-result-header">
                  <div>
                    <span className="ticket-tag">{r.codigo_ticket}</span>
                    <h2 className="consult-result-title" style={{ marginTop: '0.3rem' }}>{r.prenda}</h2>
                  </div>
                  <EstadoBadge estado={r.estado} />
                </div>

                <div className="consult-detail-grid">
                  <div className="consult-detail-item">
                    <span className="caption">Cliente</span>
                    <span className="val">{r.cliente_nombre}</span>
                  </div>
                  <div className="consult-detail-item">
                    <span className="caption">Fecha Estimada de Entrega</span>
                    <span className="val">{formatFecha(r.fecha_entrega_estimada)}</span>
                  </div>
                  <div className="consult-detail-item">
                    <span className="caption">Precio Total</span>
                    <span className="val">{formatCurrency(r.precio_total)}</span>
                  </div>
                  <div className="consult-detail-item">
                    <span className="caption">Abonado</span>
                    <span className="val">{formatCurrency(r.abono)}</span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: saldo > 0 ? 'var(--warning-bg)' : 'var(--success-bg)',
                    border: `1px solid ${saldo > 0 ? 'var(--warning-border)' : 'var(--success-border)'}`,
                    color: saldo > 0 ? 'var(--warning-text)' : 'var(--success-text)',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {saldo > 0 ? 'Saldo a cancelar al retirar la prenda:' : 'Prenda completamente pagada'}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{formatCurrency(saldo)}</span>
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
