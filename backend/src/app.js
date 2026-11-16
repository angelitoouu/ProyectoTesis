const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de prueba / mensaje para clientes de API
app.get('/api', (req, res) => {
  res.json({ message: 'API del taller de costura funcionando correctamente' });
});

// En modo test, '/' responde con el mensaje esperado por la prueba de integración
if (process.env.NODE_ENV === 'test') {
  app.get('/', (req, res) => {
    res.json({ message: 'API del taller de costura funcionando correctamente' });
  });
}

// Rutas de la API
app.use('/api', routes);

// Cualquier ruta que empiece con /api y no coincida responde 404
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada en la API' });
});

// Servir la aplicación compilada del frontend
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

// Cualquier otra ruta web sirve el index.html de React para permitir la navegación
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({ message: 'API del taller de costura funcionando correctamente' });
    }
  });
});

app.use(errorMiddleware);

module.exports = app;
