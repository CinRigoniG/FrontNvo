import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import Usuario from "../entities/Usuario";

interface UserContextType {
    usuarioL: Usuario | null;
    setUsuarioL: (user: Usuario | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usuarioL, setUsuarioL] = useState<Usuario | null>(null);

    // Leer el usuario de las cookies solo al cargar el componente
    useEffect(() => {
        const storedUser = Cookies.get("usuarioL");
        console.log("Valor de storedUser:", storedUser);
        if (storedUser) {
            setUsuarioL(JSON.parse(storedUser));
        }
    }, []); // Array de dependencias vacío

    // Guardar o eliminar el usuario en las cookies cada vez que cambie
    useEffect(() => {
        if (usuarioL) {
            Cookies.set("usuarioL", JSON.stringify(usuarioL), { sameSite: "Strict", secure: true });
        } else {
            Cookies.remove("usuarioL"); // Asegura la eliminación al cerrar sesión
        }
    }, [usuarioL]);

    return (
        <UserContext.Provider value={{ usuarioL, setUsuarioL }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe ser usado dentro de un UserProvider");
    }
    return context;
};
