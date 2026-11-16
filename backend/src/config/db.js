const { Pool } = require('pg');
const { DATABASE_URL, DB_CONFIG } = require('./env');

const pool = new Pool(
  process.env.DATABASE_URL ? { connectionString: DATABASE_URL } : DB_CONFIG
);

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err.message);
});

module.exports = pool;

