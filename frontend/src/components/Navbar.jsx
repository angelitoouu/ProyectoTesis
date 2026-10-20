import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { autenticado, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="app-navbar">
      <NavLink to={autenticado ? "/panel" : "/"} className="brand">
        <div className="brand-badge" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
        </div>
        <div>
          <span className="brand-title">Taller de Costura</span>
        </div>
      </NavLink>

      <div className="nav-links">
        {autenticado ? (
          // Vista privada para la encargada del taller
          <>
            <NavLink to="/panel" className={({ isActive }) => (isActive ? 'active' : '')}>
              Panel de Estados
            </NavLink>
            <NavLink to="/nuevo" className={({ isActive }) => (isActive ? 'active' : '')}>
              Nuevo Encargo
            </NavLink>
            <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>
              Clientes
            </NavLink>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Vista Cliente
            </NavLink>
            <button
              type="button"
              onClick={handleCerrarSesion}
              className="btn btn-secondary"
              style={{
                fontSize: '0.82rem',
                padding: '0.35rem 0.8rem',
                marginLeft: '0.5rem',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          // Vista pública para los clientes
          <>
            <NavLink to="/solicitar" className={({ isActive }) => (isActive ? 'active' : '')}>
              Nuevo Encargo
            </NavLink>
            <NavLink to="/consulta" className={({ isActive }) => (isActive ? 'active' : '')}>
              Seguimiento de Pedido
            </NavLink>
            <NavLink
              to="/login"
              className="btn btn-secondary"
              style={{
                fontSize: '0.85rem',
                padding: '0.4rem 0.9rem',
                marginLeft: '0.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              Acceso Encargada
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
