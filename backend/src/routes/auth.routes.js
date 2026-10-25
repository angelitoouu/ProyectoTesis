const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!password) {
    return res.status(400).json({
      status: 'Client error',
      message: 'La contraseña es requerida',
    });
  }

  // Si se envían credenciales completas
  return res.status(200).json({
    status: 'Success',
    message: 'Inicio de sesión exitoso',
    data: { email },
  });
});

module.exports = router;
