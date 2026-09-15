import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to="/">Nuevo Encargo</Link>
    <Link to="/panel">Panel de Estados</Link>
    <Link to="/clientes">Clientes</Link>
    <Link to="/consulta">Consulta Pública</Link>
  </nav>
);

export default Navbar;
