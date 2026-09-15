require('dotenv').config();

const fallbackDatabaseUrl = 'postgresql://postgres:1234@localhost:5432/taller_costura';
const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.DB_HOST && process.env.DB_USERNAME && process.env.DATABASE
    ? `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD || '1234'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DATABASE}`
    : fallbackDatabaseUrl);

module.exports = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: databaseUrl,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
