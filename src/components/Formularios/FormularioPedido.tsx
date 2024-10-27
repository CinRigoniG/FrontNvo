import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import PedidoService from "../../services/PedidoService";
import DetallePedidoService from "../../services/DetallePedidoService";
import DetallePedido from "../../entities/DetallePedido";
import Pedido from "../../entities/Pedido";
import { useUser } from "../../context/UserContext";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import ModalConfirmacion from "../Modales/ModalConfirmacion";

const FormularioPedido = () => {
    const navigate = useNavigate();
    const { idPedido = "0" } = useParams();
    const pedidoId = idPedido ? parseInt(idPedido, 10) : 0;

    const [pedidoObjeto, setPedidoObjeto] = useState<Pedido>({ ...new Pedido(), fecha: new Date('2024-01-01'), detallePedido: [] });
    const [txtValidacion, setTxtValidacion] = useState<string>('');
    const pedidoService = new PedidoService();
    const detallePedidoService = new DetallePedidoService();

    const [detalleAEliminar, setDetalleAEliminar] = useState<DetallePedido | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        console.log(usuarioL);
        const fetchData = async () => {
            await getPedido();
        };
        fetchData();
    }, [idPedido]);

    const getPedido = async () => {
        console.log(idPedido);
        if (pedidoId > 0) {
            try {
                const pedidoId = idPedido ? parseInt(idPedido, 10) : 0;
                const pedidoSelect = await pedidoService.get(url + 'pedido', pedidoId);
                if (pedidoSelect) {
                    const detPedidoData = await detallePedidoService.getByPedidoId(url + 'detallePedido', pedidoId);
                    const arrayData = Array.isArray(detPedidoData) ? detPedidoData : [detPedidoData];
                    pedidoSelect.detallePedido = arrayData;
                    setPedidoObjeto(pedidoSelect);
                    console.log(pedidoSelect)
                } else {
                    setTxtValidacion('No se encontro el pedido con el ID proporcionado.')
                }
            } catch (error) {
                setTxtValidacion('Error al obtener los datos del pedido.');
                console.error(error);
            }
        } else {
            setPedidoObjeto(new Pedido());
        }
    };

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

    const save = async () => {
        try {
            if (pedidoObjeto.totalPedido <= 0) {
                setTxtValidacion('El total del pedido debe ser mayor que cero.');
                return;
            }

            if (pedidoObjeto.detallePedido.length === 0) {
                setTxtValidacion('El pedido debe tener al menos un detalle.');
                return;
            }

            let result;
            if (pedidoId > 0) {
                // Actualizar pedido existente
                result = await pedidoService.put(url + 'pedido', pedidoId, pedidoObjeto);
            } else {
                // Crear nuevo pedido
                result = await pedidoService.post(url + 'pedido', pedidoObjeto);
            }

            if (result) {
                navigate('/grillaPedidos'); // Redirigir a la grilla de pedidos después de guardar
            } else {
                setTxtValidacion('No se pudo guardar el pedido. Inténtalo de nuevo.');
            }
        } catch (error) {
            setTxtValidacion('Error al guardar el pedido.');
            console.error(error);
        }
    };

    return (
        <>
            <Form className="formulario-contenedor">
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Fecha pedido</FormLabel>
                            <DatePicker
                                id="txtFecha"
                                selected={pedidoObjeto.fecha ? new Date(pedidoObjeto.fecha) : new Date('2024-01-01')}
                                onChange={(date) => setPedidoObjeto({
                                    ...pedidoObjeto,
                                    fecha: date ?? new Date('2024-01-01')
                                })}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Total pedido</FormLabel>
                            <FormControl
                                type="number"
                                id="txtTotalPedido"
                                placeholder="Ingrese el total del pedido"
                                value={pedidoObjeto.totalPedido || ''}
                                onChange={(e) => setPedidoObjeto({ ...pedidoObjeto, totalPedido: Number(e.target.value) })}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Table>
                    <thead>
                        <tr>
                            <th>Cantidad</th>
                            <th>Instrumento</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidoObjeto.detallePedido && pedidoObjeto.detallePedido.length > 0 ? (
                            pedidoObjeto.detallePedido.map((detalle: DetallePedido, index) => (
                                <tr key={index}>
                                    <td>{detalle.cantidad}</td>
                                    <td>{detalle.instrumento.instrumento}</td>
                                    <td>
                                        <Link to={`/formularioDetallePedido/${detalle.id}`}>
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>No hay detalles de pedido.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <div className="mb-12">
                    <p style={{ color: 'red' }}>{txtValidacion}</p>
                </div>
                <Row className="d-flex justify-content-center">
                    <Col md={6} className="d-flex justify-content-center">
                        <Button
                            onClick={save}
                            style={{
                                width: "150px",
                                backgroundColor: "#81c784",
                                color: "white",
                                border: "none",
                            }} // Verde
                        >
                            Guardar
                        </Button>
                    </Col>
                    <Col md={6} className="d-flex justify-content-center">
                        <Button
                            onClick={() => navigate("/grillaPedidos")}
                            style={{
                                width: "150px",
                                backgroundColor: "#9575cd",
                                color: "white",
                                border: "none",
                            }} // Lila
                        >
                            Volver
                        </Button>
                    </Col>
                </Row>
            </Form>

            <ModalConfirmacion
                isOpen={modalIsOpen}
                onRequestClose={cerrarModal}
                onConfirm={confirmarEliminar}
                contentLabel="Confirmar Eliminación"
            />
        </>
    )

}

export default FormularioPedido;