import { useEffect, useState } from "react";
import DetallePedido from "../../entities/DetallePedido";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import DetallePedidoService from "../../services/DetallePedidoService";
import { Button, Row, Table } from "react-bootstrap";
import { Roles } from "../../entities/Enums/Roles";
import ModalConfirmacion from "../Modales/ModalConfirmacion";

const GrillaDetallePedido = () => {

    const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [detalleAEliminar, setDetalleAEliminar] = useState<DetallePedido | null>(null);
    const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto
    const { idPedido = '0' } = useParams();
    const pedidoId = idPedido ? parseInt(idPedido, 10) : 0;
    const detallePedidoService = new DetallePedidoService();
    const url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        const fetchData = async () => {
            const detPedidoData = await detallePedidoService.getByPedidoId(url + 'detallePedido', pedidoId);
            const arrayData = Array.isArray(detPedidoData) ? detPedidoData : [detPedidoData];
            setDetallePedidos(arrayData);
        };
        fetchData();
    }, [pedidoId]);

    const abrirModalEliminar = (detalle: DetallePedido) => {
        setDetalleAEliminar(detalle);
        setModalIsOpen(true);
    };

    const cerrarModal = () => {
        setModalIsOpen(false);
        setDetalleAEliminar(null);
    };

    const confirmarEliminar = async () => {
        if (detalleAEliminar) {
            await detallePedidoService.delete(url + 'detallePedido', detalleAEliminar.id);
            setModalIsOpen(false);
            setDetalleAEliminar(null);
            window.location.reload();
        }
    };

    const regresar = () => {
        navigate('/grillaPedidos'); // Redirige a /grillaPedidos
    };


    return (
        <>
            <Row className="row-centrado" style={{ marginLeft: '10px' }}>
                <Button
                    className="btn-grilla"
                    onClick={regresar}
                >
                    Volver
                </Button>
            </Row>
            <Table className="tabla-grilla" striped bordered hover>
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Instrumento</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {detallePedidos.map((detalle: DetallePedido, index) => (
                        <tr key={index}>
                            <td>{detalle.cantidad}</td>
                            <td>{detalle.instrumento.instrumento}</td>
                            {usuarioL?.nombreRol === Roles.ADMIN && (
                                <>
                                    <td>
                                        <Link to={`/formularioDetPedido/${detalle.id}`}>
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <i
                                            className="bi bi-trash"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => abrirModalEliminar(detalle)}
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
                onRequestClose={cerrarModal}
                onConfirm={confirmarEliminar}
                contentLabel="Confirmar Eliminación"
            />
        </>
    );

}

export default GrillaDetallePedido;