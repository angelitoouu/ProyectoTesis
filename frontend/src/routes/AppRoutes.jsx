import { Routes, Route } from 'react-router-dom';
import NuevoEncargo from '../pages/NuevoEncargo/NuevoEncargo';
import Panel from '../pages/Panel/Panel';
import Clientes from '../pages/Clientes/Clientes';
import Consulta from '../pages/Consulta/Consulta';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<NuevoEncargo />} />
    <Route path="/panel" element={<Panel />} />
    <Route path="/clientes" element={<Clientes />} />
    <Route path="/consulta" element={<Consulta />} />
  </Routes>
);

export default AppRoutes;
