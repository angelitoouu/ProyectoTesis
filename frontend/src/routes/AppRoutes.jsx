import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Inicio from '../pages/Inicio/Inicio';
import Consulta from '../pages/Consulta/Consulta';
import NuevoEncargo from '../pages/NuevoEncargo/NuevoEncargo';
import Login from '../pages/Login/Login';
import Panel from '../pages/Panel/Panel';
import Clientes from '../pages/Clientes/Clientes';
import RutaProtegida from './RutaProtegida';

const AppRoutes = () => {
  const { autenticado } = useAuth();

  return (
    <Routes>
      {/* Inicio: si está autenticada va directo al panel, si no ve la página de inicio */}
      <Route path="/" element={autenticado ? <Navigate to="/panel" replace /> : <Inicio />} />

      {/* Vistas públicas para clientes */}
      <Route path="/solicitar" element={<NuevoEncargo />} />
      <Route path="/consulta" element={<Consulta />} />

      {/* Acceso privado para la encargada */}
      <Route path="/login" element={<Login />} />

      {/* Rutas exclusivas del taller protegidas para la encargada */}
      <Route
        path="/panel"
        element={
          <RutaProtegida>
            <Panel />
          </RutaProtegida>
        }
      />
      <Route
        path="/nuevo"
        element={
          <RutaProtegida>
            <NuevoEncargo />
          </RutaProtegida>
        }
      />
      <Route
        path="/clientes"
        element={
          <RutaProtegida>
            <Clientes />
          </RutaProtegida>
        }
      />

      {/* Redirección ante cualquier ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
