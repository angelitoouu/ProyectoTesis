import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const res = iniciarSesion(clave);
    if (res.exito) {
      navigate('/panel');
    } else {
      setError(res.mensaje);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '520px', marginTop: '2.5rem' }}>
      <div className="form-card" style={{ padding: '2.2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Acceso Encargada del Taller
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Área privada exclusiva para la administración de encargos, estados y clientes.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group">
            <label htmlFor="clave">Clave de Acceso</label>
            <input
              id="clave"
              type="password"
              placeholder="Ingresa la clave de encargada..."
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '0.8rem' }}>
            Ingresar al Taller
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>
            ← Volver a Consulta de Pedidos (Clientes)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
