import { useEffect, useState } from "react";
import Pedido from "../../entities/Pedido";
import PedidoService from "../../services/PedidoService";
import { useUser } from "../../context/UserContext";
import { Button, Row, Table } from "react-bootstrap";
import { Roles } from "../../entities/Roles";
import { Link } from "react-router-dom";
import ModalConfirmacion from "../Modales/ModalConfirmacion";
import ModalFechas from "../Modales/ModalFechas";

const GrillaPedidos = () => {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pedidoAEliminar, setPedidoAEliminar] = useState<Pedido | null>(null);
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const pedidoService = new PedidoService();
    const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto

    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const pedidosData = await pedidoService.getAll(url + "pedido");
            setPedidos(pedidosData);
        };
        fetchData();
    }, []);

    const abrirModal = () => setShowModal(true);
    const cerrarModal = () => setShowModal(false);

    const abrirModalEliminar = (pedido: Pedido) => {
        setPedidoAEliminar(pedido);
        setModalIsOpen(true);
    };

    const cerrarModalEliminar = () => {
        setModalIsOpen(false);
        setPedidoAEliminar(null);
    };

    const confirmarEliminar = async () => {
        if (pedidoAEliminar) {
            await pedidoService.delete(url + "pedido", pedidoAEliminar.id);
            setModalIsOpen(false);
            setPedidoAEliminar(null);
            window.location.reload();
        }
    };

    const generarExcel = () => {
        if (fechaDesde && fechaHasta) {
            const url = `https://depositoback-production.up.railway.app/api/pedido/downloadExcel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
            window.open(url, "_blank");
            cerrarModal();
        } else {
            alert("Por favor ingresa ambas fechas.");
        }
    };

    return (
        <>
            <Row>
                {usuarioL?.nombreRol === Roles.ADMIN && (
                    <Button onClick={abrirModal}>
                        Generar excel
                    </Button>
                )}
            </Row>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Total pedido</th>
                        {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
                        {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
                        {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido: Pedido, index) => (
                        <tr key={index}>
                            <td>{pedido.id}</td>
                            <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                            <td>{pedido.usuario?.nombre || "Sin usuario"}</td>
                            <td>{pedido.totalPedido}</td>
                            <td>
                                <Link to={`/detallePedido/${pedido.id}`}>
                                    <i className="bi bi-eye"></i>
                                </Link>
                            </td>
                            {usuarioL?.nombreRol === Roles.ADMIN && (
                                <>
                                    <td>
                                        <Link to={`/formularioPedido/${pedido.id}`}>
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <i
                                            className="bi bi-trash"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => abrirModalEliminar(pedido)}
                                        ></i>
                                    </td>
                                </>
                            )}
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

            <ModalFechas
                show={showModal}
                onHide={cerrarModal}
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
                setFechaDesde={setFechaDesde}
                setFechaHasta={setFechaHasta}
                generarExcel={generarExcel}
            />

        </>
    )
}

export default GrillaPedidos;