import { useEffect, useState } from 'react';
import api from '../../services/api';
import EstadoBadge from '../../components/EstadoBadge';

// Objetivo específico 3: historial de clientes con medidas y trabajos anteriores
const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    api.get('/clientes').then(({ data }) => setClientes(data)).catch(console.error);
  }, []);

  const verHistorial = async (id) => {
    try {
      const { data } = await api.get(`/clientes/${id}`);
      setSeleccionado(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Clientes</h1>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Teléfono</th><th>Dirección</th><th></th></tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.telefono}</td>
              <td>{c.direccion || '-'}</td>
              <td><button onClick={() => verHistorial(c.id)}>Ver historial</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {seleccionado && (
        <div className="resultado">
          <h3>Historial de {seleccionado.nombre}</h3>
          {seleccionado.encargos.length === 0 && <p>Sin encargos registrados aún.</p>}
          {seleccionado.encargos.map((e) => (
            <div className="card" key={e.id} style={{ marginTop: '0.5rem' }}>
              <strong>{e.prenda}</strong> — {e.descripcion_trabajo || 'Sin descripción'}
              <div>Medidas: {e.medidas ? JSON.stringify(e.medidas) : 'No registradas'}</div>
              <div>Entrega: {new Date(e.fecha_entrega_estimada).toLocaleDateString('es-CL')}</div>
              <EstadoBadge estado={e.estado} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clientes;
