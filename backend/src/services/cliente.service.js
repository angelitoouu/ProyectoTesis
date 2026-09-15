const pool = require('../config/db');

// Objetivo específico 3: historial de clientes con medidas y trabajos anteriores
const getAllClientes = async () => {
  const { rows } = await pool.query('SELECT * FROM clientes ORDER BY nombre ASC');
  return rows;
};

const getClienteConHistorial = async (id) => {
  const cliente = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
  if (cliente.rows.length === 0) return null;

  const encargos = await pool.query(
    'SELECT * FROM encargos WHERE cliente_id = $1 ORDER BY fecha_recepcion DESC',
    [id]
  );

  return { ...cliente.rows[0], encargos: encargos.rows };
};

const findOrCreateCliente = async ({ nombre, telefono, direccion }) => {
  const existente = await pool.query('SELECT * FROM clientes WHERE telefono = $1', [telefono]);
  if (existente.rows.length > 0) return existente.rows[0];

  const { rows } = await pool.query(
    'INSERT INTO clientes (nombre, telefono, direccion) VALUES ($1, $2, $3) RETURNING *',
    [nombre, telefono, direccion || null]
  );
  return rows[0];
};

const updateCliente = async (id, { nombre, telefono, direccion }) => {
  const { rows } = await pool.query(
    'UPDATE clientes SET nombre = $1, telefono = $2, direccion = $3 WHERE id = $4 RETURNING *',
    [nombre, telefono, direccion, id]
  );
  return rows[0];
};

module.exports = { getAllClientes, getClienteConHistorial, findOrCreateCliente, updateCliente };
