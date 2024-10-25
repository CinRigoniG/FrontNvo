import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMapMarkedAlt,
  faMusic,
  faTable,
  faShoppingCart,
  faUser,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./NavBar.css";
import { useUser } from "../../context/UserContext";
import ModalCierreSesion from "../Modales/ModalCierreSesion";
import useCart from "../../hooks/useCart";
interface NavbarProps {
  toggleCarrito: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleCarrito }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { usuarioL, setUsuarioL } = useUser();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false); // Estado para manejar el menú
  const navbarRef = useRef<HTMLDivElement>(null); // Ref para el navbar

  const cerrarSesion = () => {
    setUsuarioL(null);
    navigate("/login", { replace: true });
  };

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const toggleNavbar = () => {
    setIsOpen(prev => !prev);
  };

  // Maneja el clic fuera del navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={navbarRef}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <h6 className="titulo">Tienda</h6>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarNav"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">
                  <FontAwesomeIcon icon={faHome} />
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/DondeEstamos">
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  <FontAwesomeIcon icon={faMusic} />
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/grillaPedidos">
                  <FontAwesomeIcon icon={faList} />
                </Link>
              </li>
              {usuarioL?.nombreRol === "ADMIN" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/grillaInstrumentos">
                      <FontAwesomeIcon icon={faTable} />
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/grillaUsuarios">
                      <FontAwesomeIcon icon={faUser} />
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              {usuarioL ? (
                <>
                  <div className="usuario-container">
                    <span className="usuario-texto">Usuario: {usuarioL.nombre}</span>
                  </div>
                  <button onClick={handleLogoutClick} className="btn btn-link nav-link">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-link nav-link">
                  Iniciar Sesión
                </Link>
              )}
              <button onClick={toggleCarrito} className="cart-button">
                <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span> // Usar totalItems
                )}
              </button>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal de confirmación */}
      <ModalCierreSesion
        showModal={showModal}
        onConfirm={cerrarSesion}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default Navbar;
