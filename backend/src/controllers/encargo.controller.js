const encargoService = require('../services/encargo.service');

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
    const { nombre_cliente, telefono_cliente, prenda, precio_total, abono, fecha_entrega_estimada } = req.body;

    if (!nombre_cliente || !telefono_cliente || !prenda) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios: nombre, teléfono y prenda.'
      });
    }

    const numPrecio = Number(precio_total || 0);
    const numAbono = Number(abono || 0);

    if (isNaN(numPrecio) || numPrecio < 0) {
      return res.status(400).json({ message: 'El precio total no puede ser un número negativo.' });
    }

    if (isNaN(numAbono) || numAbono < 0) {
      return res.status(400).json({ message: 'El abono no puede ser negativo.' });
    }

    if (numAbono > numPrecio) {
      return res.status(400).json({ message: 'El abono no puede ser superior al precio total.' });
    }

    const nuevo = await encargoService.createEncargo({
      ...req.body,
      fecha_entrega_estimada: fecha_entrega_estimada || null,
      precio_total: numPrecio,
      abono: numAbono,
    });
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

const updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'en_proceso', 'listo_prueba', 'listo_retiro', 'entregado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }
    const actualizado = await encargoService.updateEstado(req.params.id, estado);
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
};

const updateEncargo = async (req, res, next) => {
  try {
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

module.exports = { getEncargos, getEncargo, createEncargo, updateEstado, updateEncargo, deleteEncargo };
