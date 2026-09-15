const pool = require('../config/db');
const generateTicket = require('../utils/generateTicket');
const { findOrCreateCliente } = require('./cliente.service');

// Objetivo específico 2: panel con estados ordenado por fecha de entrega
const getAllEncargos = async () => {
  const { rows } = await pool.query(`
    SELECT e.*, c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
    FROM encargos e
    JOIN clientes c ON c.id = e.cliente_id
    ORDER BY e.fecha_entrega_estimada ASC
  `);
  return rows;
};

const getEncargoById = async (id) => {
  const { rows } = await pool.query(
    `SELECT e.*, c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
     FROM encargos e JOIN clientes c ON c.id = e.cliente_id
     WHERE e.id = $1`,
    [id]
  );
  return rows[0];
};

// Objetivo específico 1: registro ágil de encargos (cliente, prenda, medidas, fecha, pago)
const createEncargo = async (data) => {
  const {
    nombre_cliente,
    telefono_cliente,
    direccion_cliente,
    prenda,
    descripcion_trabajo,
    medidas,
    fecha_entrega_estimada,
    precio_total,
    abono,
  } = data;

  const cliente = await findOrCreateCliente({
    nombre: nombre_cliente,
    telefono: telefono_cliente,
    direccion: direccion_cliente,
  });

  let codigo_ticket;
  let esUnico = false;
  while (!esUnico) {
    codigo_ticket = generateTicket();
    const existe = await pool.query('SELECT id FROM encargos WHERE codigo_ticket = $1', [codigo_ticket]);
    esUnico = existe.rows.length === 0;
  }

  const { rows } = await pool.query(
    `INSERT INTO encargos
      (cliente_id, codigo_ticket, prenda, descripcion_trabajo, medidas, fecha_entrega_estimada, precio_total, abono)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      cliente.id,
      codigo_ticket,
      prenda,
      descripcion_trabajo || null,
      medidas ? JSON.stringify(medidas) : null,
      fecha_entrega_estimada,
      precio_total,
      abono || 0,
    ]
  );

  return { ...rows[0], cliente_nombre: cliente.nombre, cliente_telefono: cliente.telefono };
};

// Cambio rápido de estado desde el tablero (Pendiente -> En proceso -> Listo para prueba -> Listo para retiro -> Entregado)
const updateEstado = async (id, estado) => {
  const { rows } = await pool.query(
    'UPDATE encargos SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [estado, id]
  );
  return rows[0];
};

const updateEncargo = async (id, data) => {
  const { prenda, descripcion_trabajo, medidas, fecha_entrega_estimada, precio_total, abono } = data;
  const { rows } = await pool.query(
    `UPDATE encargos SET
      prenda = $1, descripcion_trabajo = $2, medidas = $3,
      fecha_entrega_estimada = $4, precio_total = $5, abono = $6, updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [prenda, descripcion_trabajo, medidas ? JSON.stringify(medidas) : null, fecha_entrega_estimada, precio_total, abono, id]
  );
  return rows[0];
};

const deleteEncargo = async (id) => {
  await pool.query('DELETE FROM encargos WHERE id = $1', [id]);
};

// Objetivo específico 4: vista pública de consulta por teléfono o código de ticket
const buscarPublico = async (query) => {
  const cleanQuery = (query || '').trim();
  const phoneWithoutSpaces = cleanQuery.replace(/\s+/g, '');
  const { rows } = await pool.query(
    `SELECT e.codigo_ticket, e.prenda, e.estado, e.fecha_entrega_estimada,
            e.precio_total, e.abono, (e.precio_total - e.abono) AS saldo,
            c.nombre AS cliente_nombre
     FROM encargos e
     JOIN clientes c ON c.id = e.cliente_id
     WHERE UPPER(TRIM(e.codigo_ticket)) = UPPER($1)
        OR TRIM(c.telefono) = $1
        OR REPLACE(TRIM(c.telefono), ' ', '') = $2
     ORDER BY e.fecha_entrega_estimada ASC`,
    [cleanQuery, phoneWithoutSpaces]
  );
  return rows;
};

module.exports = {
  getAllEncargos,
  getEncargoById,
  createEncargo,
  updateEstado,
  updateEncargo,
  deleteEncargo,
  buscarPublico,
};
