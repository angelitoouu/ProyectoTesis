import { useState } from 'react';
import api from '../../services/api';

// Objetivo específico 1: registrar nuevos encargos (cliente, prenda, medidas, fecha de entrega y pago)
const NuevoEncargo = () => {
  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono_cliente: '',
    direccion_cliente: '',
    prenda: '',
    descripcion_trabajo: '',
    cintura: '',
    largo: '',
    tiro: '',
    fecha_entrega_estimada: '',
    precio_total: '',
    abono: '',
  });
  const [ticketGenerado, setTicketGenerado] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const medidas = {};
      if (form.cintura) medidas.cintura = Number(form.cintura);
      if (form.largo) medidas.largo = Number(form.largo);
      if (form.tiro) medidas.tiro = Number(form.tiro);

      const { data } = await api.post('/encargos', {
        nombre_cliente: form.nombre_cliente,
        telefono_cliente: form.telefono_cliente,
        direccion_cliente: form.direccion_cliente,
        prenda: form.prenda,
        descripcion_trabajo: form.descripcion_trabajo,
        medidas,
        fecha_entrega_estimada: form.fecha_entrega_estimada,
        precio_total: Number(form.precio_total),
        abono: Number(form.abono) || 0,
      });

      setTicketGenerado(data.codigo_ticket);
      setForm({
        nombre_cliente: '', telefono_cliente: '', direccion_cliente: '',
        prenda: '', descripcion_trabajo: '', cintura: '', largo: '', tiro: '',
        fecha_entrega_estimada: '', precio_total: '', abono: '',
      });
    } catch (err) {
      setError('No se pudo registrar el encargo. Revisa la conexión con el servidor.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Registrar nuevo encargo</h1>

      {ticketGenerado && (
        <div className="resultado">
          ✅ Encargo registrado. Código de ticket: <strong>{ticketGenerado}</strong>
          <br />
          Entrégaselo al cliente para que consulte el estado más adelante.
        </div>
      )}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <h3>Datos del cliente</h3>
        <input name="nombre_cliente" placeholder="Nombre del cliente" value={form.nombre_cliente} onChange={handleChange} required />
        <input name="telefono_cliente" placeholder="Teléfono (ej. +56911111111)" value={form.telefono_cliente} onChange={handleChange} required />
        <input name="direccion_cliente" placeholder="Dirección (opcional)" value={form.direccion_cliente} onChange={handleChange} />

        <h3>Datos del encargo</h3>
        <input name="prenda" placeholder="Prenda (ej. Vestido de fiesta)" value={form.prenda} onChange={handleChange} required />
        <textarea name="descripcion_trabajo" placeholder="Descripción del trabajo a realizar" value={form.descripcion_trabajo} onChange={handleChange} />

        <h3>Medidas (cm)</h3>
        <input name="cintura" type="number" placeholder="Cintura" value={form.cintura} onChange={handleChange} />
        <input name="largo" type="number" placeholder="Largo" value={form.largo} onChange={handleChange} />
        <input name="tiro" type="number" placeholder="Tiro" value={form.tiro} onChange={handleChange} />

        <h3>Entrega y pago</h3>
        <input name="fecha_entrega_estimada" type="date" value={form.fecha_entrega_estimada} onChange={handleChange} required />
        <input name="precio_total" type="number" placeholder="Precio total" value={form.precio_total} onChange={handleChange} required />
        <input name="abono" type="number" placeholder="Abono inicial" value={form.abono} onChange={handleChange} />

        <button type="submit">Registrar encargo</button>
      </form>
    </div>
  );
};

export default NuevoEncargo;
