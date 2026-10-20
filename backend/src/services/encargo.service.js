const pool = require('../config/db');
const generateTicket = require('../utils/generateTicket');
const { findOrCreateCliente } = require('./cliente.service');

// panel con estados ordenado por fecha de entrega
const getAllEncargos = async () => {
  const { rows } = await pool.query(`
    SELECT e.*, c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
    FROM encargos e
    JOIN clientes c ON c.id = e.cliente_id
    ORDER BY e.fecha_entrega_estimada ASC NULLS FIRST, e.created_at DESC
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

// registro ágil de encargos (cliente, prenda, medidas, fecha, pago)
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
    nombre: (nombre_cliente || '').trim(),
    telefono: (telefono_cliente || '').trim(),
    direccion: direccion_cliente ? direccion_cliente.trim() : null,
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

// Cambio rápido de estado desde el tablero 
const updateEstado = async (id, estado) => {
  const { rows } = await pool.query(
    'UPDATE encargos SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [estado, id]
  );
  return rows[0];
};

const updateEncargo = async (id, data) => {
  const { prenda, descripcion_trabajo, medidas, fecha_entrega_estimada, precio_total, abono, estado } = data;
  const { rows } = await pool.query(
    `UPDATE encargos SET
      prenda = COALESCE($1, prenda),
      descripcion_trabajo = COALESCE($2, descripcion_trabajo),
      medidas = CASE WHEN $3::text IS NOT NULL THEN $3::jsonb ELSE medidas END,
      fecha_entrega_estimada = COALESCE($4, fecha_entrega_estimada),
      precio_total = COALESCE($5, precio_total),
      abono = COALESCE($6, abono),
      estado = COALESCE($7, estado),
      updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [
      prenda || null,
      descripcion_trabajo || null,
      medidas ? JSON.stringify(medidas) : null,
      fecha_entrega_estimada || null,
      precio_total !== undefined ? precio_total : null,
      abono !== undefined ? abono : null,
      estado || null,
      id,
    ]
  );
  return rows[0];
};

const deleteEncargo = async (id) => {
  await pool.query('DELETE FROM encargos WHERE id = $1', [id]);
};

// vista pública de consulta por teléfono o código de ticket
const buscarPublico = async (query) => {
  const cleanQuery = (query || '').trim();
  const phoneWithoutSpaces = cleanQuery.replace(/\s+/g, '');
  const { rows } = await pool.query(
    `SELECT e.id, e.codigo_ticket, e.prenda, e.estado, e.fecha_entrega_estimada,
            e.descripcion_trabajo, e.precio_total, e.abono,
            (e.precio_total - e.abono) AS saldo,
            e.created_at,
            c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
     FROM encargos e
     JOIN clientes c ON c.id = e.cliente_id
     WHERE UPPER(TRIM(e.codigo_ticket)) = UPPER($1)
        OR TRIM(c.telefono) = $1
        OR REPLACE(TRIM(c.telefono), ' ', '') = $2
     ORDER BY e.created_at DESC`,
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
