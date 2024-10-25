import { Navigate, Outlet } from 'react-router-dom';
import { Roles } from '../../entities/Roles';
import { useUser } from '../../context/UserContext';

interface Props {
    rol: Roles;
}

function RolUsuario({ rol }: Props) {
    const { usuarioL } = useUser(); // Obtener el usuario del contexto

    // Si está logueado y tiene el rol requerido, permite el acceso
    if (usuarioL && usuarioL.nombreRol === rol) {
        return <Outlet />;
    } else if (usuarioL) {
        // Si está logueado pero no tiene el rol, redirige a 'grilla'
        return <Navigate replace to='/grillaInstrumentos' />;
    } else {
        // Si no está logueado, redirige a 'login'
        return <Navigate replace to='/login' />;
    }
}

export default RolUsuario;
