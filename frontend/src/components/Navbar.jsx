import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="app-navbar">
      <NavLink to="/" className="brand">
        <span>Taller de Costura</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Nuevo Encargo
        </NavLink>
        <NavLink to="/panel" className={({ isActive }) => (isActive ? 'active' : '')}>
          Panel de Estados
        </NavLink>
        <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>
          Clientes
        </NavLink>
        <NavLink to="/consulta" className={({ isActive }) => (isActive ? 'active' : '')}>
          Consulta Pública
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
