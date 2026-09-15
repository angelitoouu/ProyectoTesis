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
    const nuevo = await encargoService.createEncargo(req.body);
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
