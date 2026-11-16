import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const CLAVE_ENCARGADA_DEFAULT = 'admin123';

export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(() => {
    return sessionStorage.getItem('taller_encargada_auth') === 'true';
  });

  const iniciarSesion = (clave) => {
    // Clave sencilla para la encargada del taller
    if (clave === CLAVE_ENCARGADA_DEFAULT) {
      sessionStorage.setItem('taller_encargada_auth', 'true');
      setAutenticado(true);
      return { exito: true };
    }
    return { exito: false, mensaje: 'Clave incorrecta. Intenta nuevamente.' };
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem('taller_encargada_auth');
    setAutenticado(false);
  };

  return (
    <AuthContext.Provider value={{ autenticado, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
