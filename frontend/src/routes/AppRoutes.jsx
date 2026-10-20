import { Routes, Route, Navigate } from 'react-router-dom';
import Consulta from '../pages/Consulta/Consulta';
import NuevoEncargo from '../pages/NuevoEncargo/NuevoEncargo';
import Login from '../pages/Login/Login';
import Panel from '../pages/Panel/Panel';
import Clientes from '../pages/Clientes/Clientes';
import RutaProtegida from './RutaProtegida';

const AppRoutes = () => (
  <Routes>
    {/* Vistas públicas para clientes: Nuevo Encargo y Seguimiento */}
    <Route path="/" element={<NuevoEncargo />} />
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

export default AppRoutes;
