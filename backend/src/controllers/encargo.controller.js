const encargoService = require('../services/encargo.service');
const { enviarTicketPorCorreo } = require('../services/mail.service');
const {
  validateCreateEncargo,
  validateUpdateEstado,
  validateUpdateEncargo,
} = require('../validations/encargo.validation');

const getEncargos = async (req, res, next) => {
  try {
    const encargos = await encargoService.getAllEncargos();
    res.json(encargos);
  } catch (error) {
    next(error);
  }
};

const getEncargo = async (req, res, next) => {
  try {
    const encargo = await encargoService.getEncargoById(req.params.id);
    if (!encargo) return res.status(404).json({ message: 'Encargo no encontrado' });
    res.json(encargo);
  } catch (error) {
    next(error);
  }
};

const createEncargo = async (req, res, next) => {
  try {
    // Aplicación de validación delegada a la capa de validaciones
    const validation = validateCreateEncargo(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const { nombre_cliente, prenda, precio_total, abono, fecha_entrega_estimada } = req.body;
    const numPrecio = Number(precio_total || 0);
    const numAbono = Number(abono || 0);

    const nuevo = await encargoService.createEncargo({
      ...req.body,
      fecha_entrega_estimada: fecha_entrega_estimada || null,
      precio_total: numPrecio,
      abono: numAbono,
    });

    // Envío asíncrono del ticket por correo si el cliente proporcionó su email
    if (req.body.email_cliente) {
      enviarTicketPorCorreo({
        email: req.body.email_cliente,
        nombre: nombre_cliente,
        ticket: nuevo.codigo_ticket,
        prenda,
        trabajo: req.body.descripcion_trabajo,
        abono: numAbono,
        precio_total: numPrecio,
      }).catch((err) => console.error('Error no bloqueante al enviar correo:', err));
    }

    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

const updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    // Validación de estado usando el validador dedicado
    const validation = validateUpdateEstado(estado);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const actualizado = await encargoService.updateEstado(req.params.id, estado);
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
};

const updateEncargo = async (req, res, next) => {
  try {
    // Validación de datos para actualización
    const validation = validateUpdateEncargo(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const actualizado = await encargoService.updateEncargo(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
};

const deleteEncargo = async (req, res, next) => {
  try {
    await encargoService.deleteEncargo(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEncargos,
  getEncargo,
  createEncargo,
  updateEstado,
  updateEncargo,
  deleteEncargo,
};
