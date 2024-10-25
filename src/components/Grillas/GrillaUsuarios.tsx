import { useEffect, useState } from "react";
import Usuario from "../../entities/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ModalConfirmacion from "../Modales/ModalConfirmacion";

const GrillaUsuario = () => {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [usEliminar, setUsEliminar] = useState<Usuario | null>(null);
    const usuarioService = new UsuarioService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const usuariosData = await usuarioService.getAll(url + 'usuario');
            setUsuarios(usuariosData);
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
            await usuarioService.delete(url + 'usuario', usEliminar.id);
            setModalIsOpen(false);
            setUsEliminar(null);
            window.location.reload();
        };
    };

    return (
        <>
            <Row style={{ marginLeft: '10px' }}>
                <Link to="/formularioUsuario/0" className="btn-grilla">Nuevo usuario</Link >
            </Row>

            <Table className="tabla-grilla" striped bordered hover>
                <thead className="grilla">
                    <tr>
                        <th>Nombre</th>
                        <th>Rol</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario: Usuario, index) => (
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
    )

}

export default GrillaUsuario;