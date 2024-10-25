import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export const RutaPrivada = ({ children }: { children: React.ReactNode }) => {
    const { usuarioL } = useUser();

    // Si no hay usuario logueado, redirige a la página de login
    if (!usuarioL) {
        return <Navigate to="/login" />;
    }

    return children;

};
