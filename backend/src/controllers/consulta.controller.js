const encargoService = require('../services/encargo.service');

// para que el cliente consulte su encargo
const consultarEstado = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Debes indicar un teléfono o código de ticket' });
    }
    const resultados = await encargoService.buscarPublico(query);
    if (resultados.length === 0) {
      return res.status(404).json({ message: 'No se encontraron encargos con ese dato' });
    }
    res.json(resultados);
  } catch (error) {
    next(error);
  }
};

module.exports = { consultarEstado };
