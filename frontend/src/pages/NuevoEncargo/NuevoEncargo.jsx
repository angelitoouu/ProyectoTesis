import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

const NuevoEncargo = () => {
  const { autenticado } = useAuth();

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

  const [tipoMedidas, setTipoMedidas] = useState('ninguna');
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

    if (autenticado && abonoNum > precioNum) {
      setError('El abono inicial no puede ser mayor al precio total.');
      return;
    }

    if (autenticado && !form.fecha_entrega_estimada) {
      setError('Debes ingresar la fecha estimada de entrega para el taller.');
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

      // Si el cliente no fijó fecha estimada, se envía null para que la encargada la asigne al aceptar el pedido
      const fechaFinal = form.fecha_entrega_estimada || null;

      const { data } = await api.post('/encargos', {
        nombre_cliente: form.nombre_cliente.trim(),
        telefono_cliente: form.telefono_cliente.trim(),
        direccion_cliente: form.direccion_cliente.trim(),
        prenda: form.prenda.trim(),
        descripcion_trabajo: form.descripcion_trabajo.trim(),
        medidas: Object.keys(medidasPayload).length > 0 ? medidasPayload : null,
        fecha_entrega_estimada: fechaFinal,
        precio_total: autenticado ? precioNum : 0,
        abono: autenticado ? abonoNum : 0,
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
      const mensaje = err.response?.data?.message || 'No se pudo registrar el encargo. Revisa la conexión con el servidor.';
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
        <h1>{autenticado ? 'Registrar Nuevo Encargo en Taller' : 'Solicitar Nuevo Encargo'}</h1>
        <p>
          {autenticado
            ? 'Ingresa los antecedentes del cliente, las especificaciones de la prenda, medidas y condiciones de pago.'
            : 'Ingresa tus datos y lo que necesitas hacerle a tu prenda. La encargada revisará tu solicitud, calculará el presupuesto y asignará la fecha de entrega.'}
        </p>
      </div>

      {ticketGenerado && (
        <div className="alert alert-success" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div>
            <strong style={{ fontSize: '1.05rem' }}>
              {autenticado ? 'Encargo registrado exitosamente.' : '¡Solicitud enviada exitosamente al taller!'}
            </strong>
          </div>
          <p style={{ marginTop: '0.1rem' }}>
            Código de Seguimiento (Ticket):{' '}
            <span className="ticket-tag" style={{ fontSize: '0.95rem', marginLeft: '0.3rem' }}>{ticketGenerado}</span>
            <button type="button" className="btn-copy" onClick={copiarTicket}>
              {copiado ? 'Copiado' : 'Copiar ticket'}
            </button>
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--success-text)' }}>
            {autenticado
              ? 'Proporciona este código o el número de teléfono al cliente para que realice seguimiento en la Consulta Pública.'
              : 'Guarda este código o tu número de teléfono. Con él podrás consultar el estado de tu prenda y el presupuesto cuando sea evaluado por el taller.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {autenticado ? (
              <>
                <Link to="/panel" className="btn" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
                  Ver en Panel de Estados
                </Link>
                <Link to="/clientes" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
                  Ver en Clientes
                </Link>
              </>
            ) : (
              <Link to="/consulta" className="btn" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
                Consultar Estado de mi Pedido
              </Link>
            )}
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
            <h3>{autenticado ? 'Datos del Cliente' : 'Tus Datos de Contacto'}</h3>
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
              <label htmlFor="telefono_cliente">Teléfono de Contacto *</label>
              <input
                id="telefono_cliente"
                name="telefono_cliente"
                placeholder="Ej. +56911111111"
                value={form.telefono_cliente}
                onChange={handleChange}
                required
              />
              <span className="hint">Lo usarás para consultar el avance de tu prenda.</span>
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
                placeholder="Ej. Polerón, Vestido, Pantalón, Chaqueta"
                value={form.prenda}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion_trabajo">Detalle del Trabajo a Realizar *</label>
              <textarea
                id="descripcion_trabajo"
                name="descripcion_trabajo"
                placeholder="Ej. Cambiarle el cierre, ajuste de costura, basta, entalle..."
                value={form.descripcion_trabajo}
                onChange={handleChange}
                required
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
                <option value="superior">Prenda Superior (Polerón, Chaqueta, Camisa, Polera)</option>
                <option value="inferior">Prenda Inferior (Pantalón, Falda, Buzo)</option>
                <option value="completo">Vestido / Traje Completo</option>
                <option value="personalizado">Medida Personalizada</option>
                <option value="ninguna">No requiere medidas (Arreglo simple / Cierre / Basta)</option>
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

          {/* Card 4: Fechas y Presupuesto */}
          <div className="form-card">
            <h3>{autenticado ? 'Entrega y Presupuesto' : 'Fecha y Presupuesto'}</h3>
            <div className="form-group">
              <label htmlFor="fecha_entrega_estimada">
                {autenticado ? 'Fecha Estimada de Entrega *' : '¿Para cuándo necesitas tu prenda aproximadamente? (Opcional)'}
              </label>
              <input
                id="fecha_entrega_estimada"
                name="fecha_entrega_estimada"
                type="date"
                value={form.fecha_entrega_estimada}
                onChange={handleChange}
                required={autenticado}
              />
              {!autenticado && (
                <span className="hint">Si lo dejas en blanco, la encargada asignará la fecha al revisar el trabajo.</span>
              )}
            </div>

            {autenticado ? (
              <>
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
              </>
            ) : (
              <div style={{ background: 'var(--surface-alt)', border: '1px dashed var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                  Presupuesto del Trabajo
                </span>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  El valor final del arreglo y las opciones de abono serán evaluados y confirmados por la encargada del taller al recepcionar tu prenda.
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" disabled={cargando}>
            {cargando
              ? 'Enviando...'
              : autenticado
              ? 'Registrar Encargo en Taller'
              : 'Enviar Solicitud de Encargo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoEncargo;
