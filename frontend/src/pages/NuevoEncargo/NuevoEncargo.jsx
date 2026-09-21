import { useState } from 'react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

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
    busto: '',
    cadera: '',
    fecha_entrega_estimada: '',
    precio_total: '',
    abono: '',
  });

  const [ticketGenerado, setTicketGenerado] = useState(null);
  const [error, setError] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const precioNum = Number(form.precio_total) || 0;
  const abonoNum = Number(form.abono) || 0;
  const saldoCalculado = Math.max(0, precioNum - abonoNum);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (abonoNum > precioNum) {
      setError('El abono inicial no puede ser mayor al precio total.');
      return;
    }

    setCargando(true);
    try {
      const medidas = {};
      if (form.cintura) medidas.cintura = Number(form.cintura);
      if (form.largo) medidas.largo = Number(form.largo);
      if (form.tiro) medidas.tiro = Number(form.tiro);
      if (form.busto) medidas.busto = Number(form.busto);
      if (form.cadera) medidas.cadera = Number(form.cadera);

      const { data } = await api.post('/encargos', {
        nombre_cliente: form.nombre_cliente.trim(),
        telefono_cliente: form.telefono_cliente.trim(),
        direccion_cliente: form.direccion_cliente.trim(),
        prenda: form.prenda.trim(),
        descripcion_trabajo: form.descripcion_trabajo.trim(),
        medidas,
        fecha_entrega_estimada: form.fecha_entrega_estimada,
        precio_total: precioNum,
        abono: abonoNum,
      });

      setTicketGenerado(data.codigo_ticket);
      setForm({
        nombre_cliente: '',
        telefono_cliente: '',
        direccion_cliente: '',
        prenda: '',
        descripcion_trabajo: '',
        cintura: '',
        largo: '',
        tiro: '',
        busto: '',
        cadera: '',
        fecha_entrega_estimada: '',
        precio_total: '',
        abono: '',
      });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'No se pudo registrar el encargo. Revisa la conexión.';
      setError(mensaje);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const copiarTicket = () => {
    if (ticketGenerado) {
      navigator.clipboard.writeText(ticketGenerado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Registrar Nuevo Encargo</h1>
        <p>Ingresa los antecedentes del cliente, las especificaciones de la prenda, medidas y condiciones de pago.</p>
      </div>

      {ticketGenerado && (
        <div className="alert alert-success">
          <div>
            <strong>Encargo registrado exitosamente.</strong>
            <p style={{ marginTop: '0.2rem' }}>
              Código de Ticket generado:{' '}
              <span className="ticket-tag">{ticketGenerado}</span>
              <button type="button" className="btn-copy" onClick={copiarTicket}>
                {copiado ? 'Copiado' : 'Copiar ticket'}
              </button>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--success-text)', marginTop: '0.3rem' }}>
              Proporciona este código o el número de teléfono al cliente para que realice seguimiento en la Consulta Pública.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Card 1: Cliente */}
          <div className="form-card">
            <h3>Datos del Cliente</h3>
            <div className="form-group">
              <label htmlFor="nombre_cliente">Nombre Completo *</label>
              <input
                id="nombre_cliente"
                name="nombre_cliente"
                placeholder="Ej. María Elena Pérez"
                value={form.nombre_cliente}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono_cliente">Teléfono de Contacto *</label>
              <input
                id="telefono_cliente"
                name="telefono_cliente"
                placeholder="Ej. +56911111111"
                value={form.telefono_cliente}
                onChange={handleChange}
                required
              />
              <span className="hint">Se usará para consultar estados y contacto.</span>
            </div>
            <div className="form-group">
              <label htmlFor="direccion_cliente">Dirección (Opcional)</label>
              <input
                id="direccion_cliente"
                name="direccion_cliente"
                placeholder="Ej. Calle Los Carrera 450, Penco"
                value={form.direccion_cliente}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Card 2: Prenda y Trabajo */}
          <div className="form-card">
            <h3>Prenda y Especificaciones</h3>
            <div className="form-group">
              <label htmlFor="prenda">Tipo de Prenda *</label>
              <input
                id="prenda"
                name="prenda"
                placeholder="Ej. Vestido de fiesta, Pantalón de vestir"
                value={form.prenda}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion_trabajo">Detalle del Trabajo a Realizar</label>
              <textarea
                id="descripcion_trabajo"
                name="descripcion_trabajo"
                placeholder="Ej. Ajuste de cintura, basta, cambio de cierre..."
                value={form.descripcion_trabajo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Card 3: Medidas */}
          <div className="form-card">
            <h3>Medidas Principales (cm)</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="cintura">Cintura</label>
                <input
                  id="cintura"
                  name="cintura"
                  type="number"
                  placeholder="cm"
                  value={form.cintura}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="largo">Largo</label>
                <input
                  id="largo"
                  name="largo"
                  type="number"
                  placeholder="cm"
                  value={form.largo}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tiro">Tiro</label>
                <input
                  id="tiro"
                  name="tiro"
                  type="number"
                  placeholder="cm"
                  value={form.tiro}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="busto">Busto</label>
                <input
                  id="busto"
                  name="busto"
                  type="number"
                  placeholder="cm"
                  value={form.busto}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cadera">Cadera</label>
              <input
                id="cadera"
                name="cadera"
                type="number"
                placeholder="cm"
                value={form.cadera}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Card 4: Fechas y Pago */}
          <div className="form-card">
            <h3>Entrega y Presupuesto</h3>
            <div className="form-group">
              <label htmlFor="fecha_entrega_estimada">Fecha Estimada de Entrega *</label>
              <input
                id="fecha_entrega_estimada"
                name="fecha_entrega_estimada"
                type="date"
                value={form.fecha_entrega_estimada}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="precio_total">Precio Total ($) *</label>
                <input
                  id="precio_total"
                  name="precio_total"
                  type="number"
                  min="0"
                  placeholder="Ej. 25000"
                  value={form.precio_total}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="abono">Abono Inicial ($)</label>
                <input
                  id="abono"
                  name="abono"
                  type="number"
                  min="0"
                  placeholder="Ej. 10000"
                  value={form.abono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="financial-summary">
              <span className="label">Saldo Pendiente a Cobrar:</span>
              <span className="amount">{formatCurrency(saldoCalculado)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar Encargo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoEncargo;
