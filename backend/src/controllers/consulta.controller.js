const encargoService = require('../services/encargo.service');
const { validateConsulta } = require('../validations/consulta.validation');

// para que el cliente consulte su encargo
const consultarEstado = async (req, res, next) => {
  try {
    const { query } = req.query;
    const validation = validateConsulta(query);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
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
