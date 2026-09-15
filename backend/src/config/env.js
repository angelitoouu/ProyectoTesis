require('dotenv').config();

const host = process.env.DB_HOST || process.env.HOST || 'localhost';
const port = process.env.DB_PORT || 5432;
const username = process.env.DB_USERNAME || 'postgres';
const password = process.env.PASSWORD || process.env.DB_PASSWORD || '1234';
const database = process.env.DATABASE || 'TallerCostura';

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${username}:${password}@${host}:${port}/${database}`;

module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: databaseUrl,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
