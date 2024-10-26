import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavbarSistema from "./components/NavBarSistema/NavBarSistema";
import { UserProvider } from "./context/UserContext";
import { useState } from "react";
import { CarritoContextProvider } from "./context/CarritoContext";
import { Carrito } from "./components/Carrito/Carrito";
import "./App.css"

function App() {
  const [carritoVisible, setCarritoVisible] = useState(false); // Estado para controlar la visibilidad del carrito

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible); // Alternar la visibilidad del carrito
  };

  return (
    <UserProvider>
      <CarritoContextProvider>
        <BrowserRouter>
          <NavbarSistema toggleCarrito={toggleCarrito}/>
          <AppRoutes/>
          {carritoVisible && ( // Mostrar el carrito en la parte derecha
            <div className="carrito-wrapper">
              <Carrito toggleCarrito={toggleCarrito} /> {/* Pasar la función correcta aquí */}
            </div>
          )}
        </BrowserRouter>
      </CarritoContextProvider>
    </UserProvider>
  );
}

export default App;
