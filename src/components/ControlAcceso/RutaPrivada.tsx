import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export const RutaPrivada: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { usuarioL, isLoading } = useUser();

    // Muestra una pantalla de carga mientras se obtiene el estado de autenticación
    if (isLoading) {
        return <div>Cargando...</div>; // O usa un componente de cargando
    }

    // Redirige a /login si no hay un usuario
    return usuarioL ? <>{children}</> : <Navigate to="/login" />;
};
