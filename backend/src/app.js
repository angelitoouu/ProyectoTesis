const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de la API primero
app.use('/api', routes);

// Servir la aplicación compilada del frontend
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

// Cualquier otra ruta sirve el index.html de React para permitir la navegación de React Router
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
