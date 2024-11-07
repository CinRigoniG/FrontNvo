import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUser,
  faBuilding,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import "./PantallaAdmin.css"; // Asegúrate de crear un archivo CSS para estilos

const PantallaAdmin = () => {
  return (
    <div className="pantalla-admin">
      <div className="bienvenida-container">
        <h1 className="bienvenida-titulo">
          <FontAwesomeIcon icon={faUserCog} className="icono-bienvenida" />
          Bienvenido, Administrador
        </h1>
        <h6 className="subtitulo">Aquí podras encontrar todas las secciones del sistema y poder acceder a cada una de ellas para realizar los cambios que desees!!</h6>
      </div>
      <div className="tarjetas-container">
        <div className="tarjeta" style={{ backgroundColor: "#FFF8B0" }}>
          {" "}
          {/* Color amarillo */}
          <Link to="/empresaSucursal" className="tarjeta-link">
            <FontAwesomeIcon icon={faBuilding} className="icono-tarjeta" />{" "}
            <h3>Grilla de Empresa</h3> 
            <p className="descripcion">
              Administra tus sucursales: visualiza, edita, elimina y crea nuevas
              sucursales para tu empresa.
            </p>{" "}
            {/* Descripción actualizada */}
          </Link>
        </div>
        {/* Tarjeta para Grilla Pedidos */}
        <div className="tarjeta" style={{ backgroundColor: "#98FB98" }}>
          <Link to="/grillaPedidos" className="tarjeta-link">
            <FontAwesomeIcon icon={faList} className="icono-tarjeta" />
            <h3>Grilla Pedidos</h3>
            <p className="descripcion">
              Administra tus pedidos: visualiza, edita, elimina y crea nuevos
              pedidos.
            </p>
          </Link>
        </div>
        {/* Tarjeta para Grilla Usuarios */}
        <div className="tarjeta" style={{ backgroundColor: "#e0b3f7" }}>
          <Link to="/grillaUsuarios" className="tarjeta-link">
            <FontAwesomeIcon icon={faUser} className="icono-tarjeta" />
            <h3>Grilla Usuarios</h3>
            <p className="descripcion">
              Controla los usuarios: visualiza, edita, elimina y crea nuevos
              usuarios.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PantallaAdmin;
