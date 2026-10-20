require('dotenv').config();

const host = process.env.DB_HOST || process.env.HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 5432;
const username = process.env.DB_USERNAME || 'postgres';
const password = process.env.PASSWORD || process.env.DB_PASSWORD || '1234';
const database = process.env.DATABASE || process.env.DB_NAME || 'TallerCostura';

const dbConfig = {
  host,
  port,
  user: username,
  password: String(password),
  database,
};

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${username}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  DB_CONFIG: dbConfig,
  DATABASE_URL: databaseUrl,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

