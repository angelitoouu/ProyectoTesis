const app = require('./src/app');
const { PORT } = require('./src/config/env');

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está en uso por otro proceso.`);
  } else {
    console.error('Error al iniciar el servidor:', err);
  }
});

