import { ReactNode, createContext, useState } from "react";
import DetallePedido from "../entities/DetallePedido";
import DetallePedidoService from "../services/DetallePedidoService";
import Instrumento from "../entities/Instrumento";
import Pedido from "../entities/Pedido";
import PedidoService from "../services/PedidoService";
import Usuario from "../entities/Usuario";
import { useUser } from '../context/UserContext';
import "./CarritoContext.css";

interface CartContextType {
    cart: DetallePedido[],
    addCarrito: (product: Instrumento) => void,
    descontarCarrito: (product: Instrumento) => void, // Asegúrate de que este método esté aquí
    removeCarrito: (product: Instrumento) => void,
    removeItemCarrito: (product: Instrumento) => void,
    limpiarCarrito: () => void,
    crearPedidoDetalle: () => Promise<number>,
    usuario: Usuario | null // Cambiar el nombre a 'usuario' para que coincida
    totalItems: number
}

// Crear contexto
export const CartContext = createContext<CartContextType>({
    cart: [],
    descontarCarrito: () => { },
    addCarrito: () => { },
    removeCarrito: () => { },
    removeItemCarrito: () => { },
    limpiarCarrito: () => { },
    crearPedidoDetalle: async () => 0,
    usuario: null,
    totalItems: 0
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {
    const { usuarioL } = useUser(); // Obtener el usuario del contexto
    const [cart, setCart] = useState<DetallePedido[]>([]);

    const detallePedidoService = new DetallePedidoService();
    const pedidoService = new PedidoService();
    const url = import.meta.env.VITE_API_URL;

    const totalItems = cart.reduce((total, detalle) => total + detalle.cantidad, 0);

    const addCarrito = (product: Instrumento) => {
        const existe = cart.some((detalle) => detalle.instrumento.id === product.id);
        if (existe) {
            const cartClonado = cart.map((detalle) =>
                detalle.instrumento.id === product.id
                    ? { ...detalle, cantidad: detalle.cantidad + 1 }
                    : detalle
            );
            setCart(cartClonado);
        } else {
            const nuevoDetalle: DetallePedido = {
                id: cart.length + 1,
                cantidad: 1,
                instrumento: product,
                pedido: new Pedido(),
                pedidoId: 0
            };
            setCart((prevCart) => [...prevCart, nuevoDetalle]);
        }
    };

    const descontarCarrito = (product: Instrumento) => {
        const existe = cart.some((detalle) => detalle.instrumento.id === product.id);
        if (existe) {
            const cartClonado = cart.map((detalle) =>
                detalle.instrumento.id === product.id
                    ? { ...detalle, cantidad: detalle.cantidad - 1 }
                    : detalle
            ).filter((detalle) => detalle.cantidad > 0); // Elimina productos con cantidad 0
            setCart(cartClonado);
        }
    };

    const removeCarrito = async (product: Instrumento) => {
        await setCart(prevCart => prevCart.filter(item => item.instrumento.id !== product.id));
    };

    const removeItemCarrito = (product: Instrumento) => {
        const existe = cart.some((detalle) => detalle.instrumento.id === product.id);
        if (existe) {
            const cartClonado = cart.map((detalle) =>
                detalle.instrumento.id === product.id
                    ? { ...detalle, cantidad: detalle.cantidad - 1 }
                    : detalle
            ).filter((detalle) => detalle.cantidad > 0);
            setCart(cartClonado);
        }
    };

    const limpiarCarrito = () => {
        setCart([]);
    };

    const crearPedidoDetalle = async (): Promise<number> => {
        try {
            if (!usuarioL) {
                throw new Error('Usuario no autenticado');
            }

            const nuevoPedido = new Pedido();
            nuevoPedido.fecha = new Date();
            nuevoPedido.totalPedido = cart.reduce((total, detalle) => total + detalle.instrumento.precio * detalle.cantidad, 0);
            if (!usuarioL.id) {
                throw new Error('Usuario ID no está disponible');
            }
            nuevoPedido.usuarioId = usuarioL.id;
            nuevoPedido.usuario = usuarioL;

            const respuestaPedido = await pedidoService.post(url + "pedido", nuevoPedido);
            const pedidoId = respuestaPedido.id;

            const detallesConPedido: DetallePedido[] = cart.map(detalle => {
                const pedidoDetalle = new DetallePedido();
                pedidoDetalle.instrumento = detalle.instrumento;
                pedidoDetalle.cantidad = detalle.cantidad;
                pedidoDetalle.pedido = respuestaPedido;
                pedidoDetalle.pedidoId = pedidoId;
                return pedidoDetalle;
            });

            const detallesRespuesta = await Promise.all(detallesConPedido.map(detalle => detallePedidoService.post(url + "detallePedido", detalle)));

            console.log(detallesRespuesta);
            limpiarCarrito();
            return pedidoId;
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            throw error;
        }
    };

    return (
        <CartContext.Provider value={{ cart, addCarrito, limpiarCarrito, removeCarrito, removeItemCarrito, descontarCarrito, crearPedidoDetalle, usuario: usuarioL, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}
