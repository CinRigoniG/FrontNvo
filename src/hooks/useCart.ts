import { useContext } from "react"; // Asegúrate de que la ruta sea correcta
import { CartContext } from "../context/CarritoContext";

const useCart = () => {
    return useContext(CartContext);
};

export default useCart;
