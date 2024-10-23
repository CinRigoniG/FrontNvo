import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export const RutaPrivada = ({ children }: { children: React.ReactNode }) => {
    const { usuarioL } = useUser(); // Obtener el usuario del contexto

    return usuarioL ? children : <Navigate to='/login' />;
};
