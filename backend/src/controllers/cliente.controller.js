const clienteService = require('../services/cliente.service');

const getClientes = async (req, res, next) => {
  try {
    const clientes = await clienteService.getAllClientes();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const getCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.getClienteConHistorial(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.updateCliente(req.params.id, req.body);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

module.exports = { getClientes, getCliente, updateCliente };
