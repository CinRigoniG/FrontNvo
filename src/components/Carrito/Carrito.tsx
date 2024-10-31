import { useState } from "react";
import DetallePedido from "../../entities/DetallePedido";
import { useCarrito } from "../../hooks/useCarrito";
import { Roles } from "../../entities/Enums/Roles";
import { useUser } from "../../context/UserContext";
import { BiBasket, BiMinus, BiPlus } from "react-icons/bi"; // Icono para el carrito
import { FaTrash } from "react-icons/fa"; // Icono para limpiar
import "./Carrito.css";

interface CartItemProps {
  detalle: DetallePedido;
  onAgregar: () => void; // Prop para agregar
  onDescontar: () => void; // Prop para descontar
}

interface CarritoProps {
  toggleCarrito: () => void;
}

function CartItem({ detalle, onAgregar, onDescontar }: CartItemProps) {
  return (
    <div key={detalle.id} className="cart-item">
      <span>
        <img
          width={50}
          height={50}
          src={`/images/${detalle.instrumento.imagen}`}
          alt={detalle.instrumento.instrumento}
        />
        <div>
          <strong>{detalle.instrumento.instrumento}</strong> - $
          {detalle.instrumento.precio}
        </div>
        <div>
          <b>
            {detalle.cantidad} {detalle.cantidad === 1 ? "unidad" : "unidades"}
          </b>
        </div>
        <div className="botones-container">
          <button onClick={onAgregar} className="btn-cambiar">
            <BiPlus size={20} /> {/* Agregar icono */}
          </button>
          <button onClick={onDescontar} className="btn-cambiar">
            <BiMinus size={20} /> {/* Restar icono */}
          </button>
        </div>
      </span>
      <hr />
    </div>
  );
}

export function Carrito({ toggleCarrito }: CarritoProps) {
  const {
    cart,
    limpiarCarrito,
    crearPedidoDetalle,
    addCarrito,
    descontarCarrito,
  } = useCarrito();
  const [idPedido, setIdPedido] = useState<number | null>(null);
  const { usuarioL } = useUser();

  const handleGuardarCarrito = async () => {
    try {
      const nuevoIdPedido = await crearPedidoDetalle();
      setIdPedido(nuevoIdPedido);
      setTimeout(() => setIdPedido(null), 5000);
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
    }
  };

  const totalProductos = cart.reduce(
    (total, detalle) => total + detalle.instrumento.precio * detalle.cantidad,
    0
  );

  const handleAgregarProducto = (detalle: DetallePedido) => {
    addCarrito(detalle.instrumento); // Llama a la función del contexto para agregar
  };

  const handleDescontarProducto = (detalle: DetallePedido) => {
    descontarCarrito(detalle.instrumento); // Llama a la función del contexto para descontar
  };

  if (idPedido !== null) {
    return (
      <div className="text-center text-green m-3">
        El pedido con id {idPedido} se guardó correctamente!
      </div>
    );
  }

  return (
    <aside className="cart">
      <button
        onClick={toggleCarrito}
        className="btn-close"
        aria-label="Cerrar Carrito"
      >
        &times;
      </button>
      <header className="cart-header">
        <BiBasket size={25} />
        <h2>Tu carrito de compras</h2>
      </header>

      {totalProductos === 0 ? (
        <p className="text-danger">Sin instrumentos en el carrito.</p>
      ) : (
        <>
          <ul>
            {cart.map((detalle, index) => (
              <CartItem
                detalle={detalle}
                key={index}
                onAgregar={() => handleAgregarProducto(detalle)}
                onDescontar={() => handleDescontarProducto(detalle)}
              />
            ))}
          </ul>
          <div className="cart-total">
            <p>Total pedido</p>
            <h4 className="total-monto">${totalProductos}</h4>
          </div>

          <div
            className="botones-container"
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <button
              onClick={limpiarCarrito}
              title="Limpiar Todo"
              style={{
                backgroundColor: "#f18d9b",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <FaTrash size={20} style={{ marginRight: "8px" }} />
              Limpiar
            </button>
          </div>

          {(usuarioL?.nombreRol === Roles.ADMIN ||
            usuarioL?.nombreRol === Roles.OPERADOR) && (
            <div
              className="botones-container"
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "20px 0",
              }}
            >
              <button className="btn-guardar" onClick={handleGuardarCarrito}>
                GUARDAR PEDIDO
              </button>
            </div>
          )}

          <div
            className="botones-container"
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <button className="btn-agregar-producto" onClick={toggleCarrito}>
              Agregar producto
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
