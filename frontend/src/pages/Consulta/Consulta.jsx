import { useState } from 'react';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';

// Objetivo específico 4: vista pública de consulta por teléfono o código de ticket
const Consulta = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setError(null);
    setResultados(null);
    try {
      const { data } = await api.get('/consulta', { params: { query } });
      setResultados(data);
    } catch (err) {
      setError('No encontramos encargos con ese dato. Verifica el teléfono o código.');
    }
  };

  return (
    <div className="container">
      <h1>Consulta el estado de tu prenda</h1>
      <p>Ingresa tu número de teléfono o el código de ticket que te entregamos.</p>

      <form onSubmit={handleBuscar}>
        <input
          placeholder="Teléfono o código (ej. TK-1234)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Consultar</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {resultados && resultados.map((r) => (
        <div className="resultado" key={r.codigo_ticket}>
          <h3>{r.prenda}</h3>
          <p>Cliente: {r.cliente_nombre}</p>
          <p>Ticket: {r.codigo_ticket}</p>
          <p>Fecha estimada de entrega: {new Date(r.fecha_entrega_estimada).toLocaleDateString('es-CL')}</p>
          <p>Saldo pendiente: ${r.saldo}</p>
          <EstadoBadge estado={r.estado} />
        </div>
      ))}
    </div>
  );
};

export default Consulta;
