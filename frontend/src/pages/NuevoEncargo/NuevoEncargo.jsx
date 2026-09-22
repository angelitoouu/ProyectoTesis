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
    fecha_entrega_estimada: '',
    precio_total: '',
    abono: '',
  });

  const [tipoMedidas, setTipoMedidas] = useState('superior');
  const [medidas, setMedidas] = useState({
    pecho: '',
    largo: '',
    manga: '',
    hombros: '',
    cintura: '',
    cadera: '',
    nombre_personalizado: '',
    valor_personalizado: '',
  });

  const [ticketGenerado, setTicketGenerado] = useState(null);
  const [error, setError] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedidaChange = (e) => {
    setMedidas({ ...medidas, [e.target.name]: e.target.value });
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
      const medidasPayload = {};

      if (tipoMedidas === 'superior') {
        if (medidas.pecho) medidasPayload.pecho = Number(medidas.pecho);
        if (medidas.largo) medidasPayload.largo = Number(medidas.largo);
        if (medidas.manga) medidasPayload.manga = Number(medidas.manga);
        if (medidas.hombros) medidasPayload.hombros = Number(medidas.hombros);
      } else if (tipoMedidas === 'inferior') {
        if (medidas.cintura) medidasPayload.cintura = Number(medidas.cintura);
        if (medidas.largo) medidasPayload.largo = Number(medidas.largo);
        if (medidas.cadera) medidasPayload.cadera = Number(medidas.cadera);
      } else if (tipoMedidas === 'completo') {
        if (medidas.pecho) medidasPayload.pecho = Number(medidas.pecho);
        if (medidas.cintura) medidasPayload.cintura = Number(medidas.cintura);
        if (medidas.cadera) medidasPayload.cadera = Number(medidas.cadera);
        if (medidas.largo) medidasPayload.largo = Number(medidas.largo);
      } else if (tipoMedidas === 'personalizado') {
        if (medidas.nombre_personalizado.trim() && medidas.valor_personalizado) {
          medidasPayload[medidas.nombre_personalizado.trim().toLowerCase()] = Number(medidas.valor_personalizado);
        }
      }

      const { data } = await api.post('/encargos', {
        nombre_cliente: form.nombre_cliente.trim(),
        telefono_cliente: form.telefono_cliente.trim(),
        direccion_cliente: form.direccion_cliente.trim(),
        prenda: form.prenda.trim(),
        descripcion_trabajo: form.descripcion_trabajo.trim(),
        medidas: Object.keys(medidasPayload).length > 0 ? medidasPayload : null,
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
        fecha_entrega_estimada: '',
        precio_total: '',
        abono: '',
      });
      setMedidas({
        pecho: '',
        largo: '',
        manga: '',
        hombros: '',
        cintura: '',
        cadera: '',
        nombre_personalizado: '',
        valor_personalizado: '',
      });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'No se pudo registrar el encargo. Revisa la conexion.';
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
              Codigo de Ticket generado:{' '}
              <span className="ticket-tag">{ticketGenerado}</span>
              <button type="button" className="btn-copy" onClick={copiarTicket}>
                {copiado ? 'Copiado' : 'Copiar ticket'}
              </button>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--success-text)', marginTop: '0.3rem' }}>
              Proporciona este codigo o el numero de telefono al cliente para que realice seguimiento en la Consulta Publica.
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
                placeholder="Ej. Maria Elena Perez"
                value={form.nombre_cliente}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono_cliente">Telefono de Contacto *</label>
              <input
                id="telefono_cliente"
                name="telefono_cliente"
                placeholder="Ej. +56911111111"
                value={form.telefono_cliente}
                onChange={handleChange}
                required
              />
              <span className="hint">Se usara para consultar estados y contacto.</span>
            </div>
            <div className="form-group">
              <label htmlFor="direccion_cliente">Direccion (Opcional)</label>
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
                placeholder="Ej. Poleron, Vestido, Pantalon, Chaqueta"
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
                placeholder="Ej. Cambiarle el cierre, ajuste de costura, basta..."
                value={form.descripcion_trabajo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Card 3: Medidas adaptables */}
          <div className="form-card">
            <h3>Medidas de la Prenda</h3>
            <div className="form-group">
              <label htmlFor="tipo_medida">Tipo de Medida / Prenda</label>
              <select
                id="tipo_medida"
                value={tipoMedidas}
                onChange={(e) => setTipoMedidas(e.target.value)}
              >
                <option value="superior">Prenda Superior (Poleron, Chaqueta, Camisa, Polera)</option>
                <option value="inferior">Prenda Inferior (Pantalon, Falda, Buzo)</option>
                <option value="completo">Vestido / Traje Completo</option>
                <option value="personalizado">Medida Personalizada</option>
                <option value="ninguna">No requiere medidas (Arreglo simple / Cierre)</option>
              </select>
            </div>

            {tipoMedidas === 'superior' && (
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="pecho">Pecho (cm)</label>
                  <input
                    id="pecho"
                    name="pecho"
                    type="number"
                    placeholder="cm"
                    value={medidas.pecho}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="largo">Largo (cm)</label>
                  <input
                    id="largo"
                    name="largo"
                    type="number"
                    placeholder="cm"
                    value={medidas.largo}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="manga">Manga (cm)</label>
                  <input
                    id="manga"
                    name="manga"
                    type="number"
                    placeholder="cm"
                    value={medidas.manga}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hombros">Hombros (cm)</label>
                  <input
                    id="hombros"
                    name="hombros"
                    type="number"
                    placeholder="cm"
                    value={medidas.hombros}
                    onChange={handleMedidaChange}
                  />
                </div>
              </div>
            )}

            {tipoMedidas === 'inferior' && (
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="cintura">Cintura (cm)</label>
                  <input
                    id="cintura"
                    name="cintura"
                    type="number"
                    placeholder="cm"
                    value={medidas.cintura}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="largo">Largo (cm)</label>
                  <input
                    id="largo"
                    name="largo"
                    type="number"
                    placeholder="cm"
                    value={medidas.largo}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cadera">Cadera (cm)</label>
                  <input
                    id="cadera"
                    name="cadera"
                    type="number"
                    placeholder="cm"
                    value={medidas.cadera}
                    onChange={handleMedidaChange}
                  />
                </div>
              </div>
            )}

            {tipoMedidas === 'completo' && (
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="pecho">Busto / Pecho (cm)</label>
                  <input
                    id="pecho"
                    name="pecho"
                    type="number"
                    placeholder="cm"
                    value={medidas.pecho}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cintura">Cintura (cm)</label>
                  <input
                    id="cintura"
                    name="cintura"
                    type="number"
                    placeholder="cm"
                    value={medidas.cintura}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cadera">Cadera (cm)</label>
                  <input
                    id="cadera"
                    name="cadera"
                    type="number"
                    placeholder="cm"
                    value={medidas.cadera}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="largo">Largo Total (cm)</label>
                  <input
                    id="largo"
                    name="largo"
                    type="number"
                    placeholder="cm"
                    value={medidas.largo}
                    onChange={handleMedidaChange}
                  />
                </div>
              </div>
            )}

            {tipoMedidas === 'personalizado' && (
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="nombre_personalizado">Nombre de la Medida</label>
                  <input
                    id="nombre_personalizado"
                    name="nombre_personalizado"
                    placeholder="Ej. Cuello, Basta, Cierre"
                    value={medidas.nombre_personalizado}
                    onChange={handleMedidaChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="valor_personalizado">Valor (cm)</label>
                  <input
                    id="valor_personalizado"
                    name="valor_personalizado"
                    type="number"
                    placeholder="cm"
                    value={medidas.valor_personalizado}
                    onChange={handleMedidaChange}
                  />
                </div>
              </div>
            )}

            {tipoMedidas === 'ninguna' && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                Este trabajo no requiere registrar medidas corporales (ej. cambio de cierre o zurcido).
              </p>
            )}
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
