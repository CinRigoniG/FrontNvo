import { useEffect, useState } from "react";
import Usuario from "../../entities/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { Form, InputGroup, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ModalConfirmacion from "../Modales/ModalConfirmacion";
import "./Grillas.css";

const GrillaUsuario = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [usEliminar, setUsEliminar] = useState<Usuario | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [roles, setRoles] = useState<string[]>([]); // Para almacenar los roles únicos
  const [filtroRol, setFiltroRol] = useState(""); // Para almacenar el filtro de rol seleccionado
  const usuarioService = new UsuarioService();

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const usuariosData = await usuarioService.getAll(url + "usuario");
      setUsuarios(usuariosData);

      // Extraer roles únicos
      const rolesUnicos = [
        ...new Set(usuariosData.map((usuario) => usuario.nombreRol)),
      ];
      setRoles(rolesUnicos);
    };
    fetchData();
  }, []);

  const abrirModalEliminar = (usuario: Usuario) => {
    setUsEliminar(usuario);
    setModalIsOpen(true);
  };

  const cerrarModalEliminar = () => {
    setModalIsOpen(false);
    setUsEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (usEliminar) {
      await usuarioService.delete(url + "usuario", usEliminar.id);
      setModalIsOpen(false);
      setUsEliminar(null);
      window.location.reload();
    }
  };

  const filtrarPorBusqueda = (usuario: Usuario) => {
    return usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
  };

  const filtrarPorRol = (usuario: Usuario) => {
    return filtroRol ? usuario.nombreRol === filtroRol : true;
  };

  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Nombre de Usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="filtro-busqueda"
        />
        <Form.Select
          className="filtro-select"
          onChange={(e) => setFiltroRol(e.target.value)}
          value={filtroRol}
        >
          <option value="">Todos los Roles</option>
          {roles.map((rol, index) => (
            <option key={index} value={rol}>
              {rol}
            </option>
          ))}
        </Form.Select>
      </InputGroup>

      <Row className="row-centrado" style={{ marginLeft: "10px" }}>
        <Link to="/formularioUsuario/0" className="botones-grilla">
          Nuevo usuario
        </Link>
      </Row>

      <Table className="tabla-grilla" striped bordered hover>
        <thead className="grilla">
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter(filtrarPorBusqueda)
            .filter(filtrarPorRol)
            .map((usuario: Usuario, index) => (
              <tr key={index}>
                <td>{usuario.nombre}</td>
                <td>{usuario.nombreRol}</td>
                <td>
                  <Link to={`/formularioUsuario/${usuario.id}`}>
                    <i className="bi bi-pencil icono-editar"></i>
                  </Link>
                </td>
                <td>
                  <i
                    className="bi bi-trash icono-borrar"
                    style={{ cursor: "pointer" }}
                    onClick={() => abrirModalEliminar(usuario)}
                  ></i>
                </td>
                <td>
                  <Link
                    to={`/formularioPersona/${usuario.id}`}
                    className="link-personal-data"
                  >
                    Datos Personales
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <ModalConfirmacion
        isOpen={modalIsOpen}
        onRequestClose={cerrarModalEliminar}
        onConfirm={confirmarEliminar}
        contentLabel="Confirmar Eliminación"
      />
    </>
  );
};

export default GrillaUsuario;
