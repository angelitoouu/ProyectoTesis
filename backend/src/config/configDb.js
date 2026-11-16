// Configuración de DataSource simulada para compatibilidad con la guía de pruebas
const AppDataSource = {
  isInitialized: false,
  async initialize() {
    this.isInitialized = true;
    return this;
  },
  async destroy() {
    this.isInitialized = false;
    return this;
  },
};

module.exports = { AppDataSource };
