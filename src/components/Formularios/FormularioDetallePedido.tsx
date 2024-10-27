import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import DetallePedido from "../../entities/DetallePedido";
import DetallePedidoService from "../../services/DetallePedidoService";
import InstrumentoService from "../../services/InstrumentoService";
import { useUser } from "../../context/UserContext";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, ListGroup, Row } from "react-bootstrap";

const FormularioDetallPedido = () => {

    const navigate = useNavigate();
    const { idDetPedido = "0" } = useParams();
    const detPedidoId = idDetPedido ? parseInt(idDetPedido, 10) : 0;
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [detPedidoObjeto, setDetPedidoObjeto] = useState<DetallePedido>(
        new DetallePedido()
    );
    const [selectedInstrumento, setSelectedInstrumento] = useState<Instrumento>(
        new Instrumento()
    );
    const [searchTerm, setSearchTerm] = useState<string>(""); // El término de búsqueda inicial
    const [filteredInstrumentos, setFilteredInstrumentos] = useState<
        Instrumento[]
    >([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Controla la apertura del desplegable
    const detallePedidoService = new DetallePedidoService();
    const instrumentoService = new InstrumentoService();
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        console.log(usuarioL);
        const fetchData = async () => {
            await getDetPedido();
            const instrumentosData = await instrumentoService.getAll(
                url + "instrumento"
            );
            setInstrumentos(instrumentosData);
            setFilteredInstrumentos(instrumentosData); // Inicialmente muestra todos
        };
        fetchData();
    }, [idDetPedido]);

    const getDetPedido = async () => {
        if (detPedidoId > 0) {
            try {
                const detalleSelect = await detallePedidoService.get(
                    url + "detallePedido",
                    detPedidoId
                );
                if (detalleSelect) {
                    setDetPedidoObjeto(detalleSelect);
                    setSelectedInstrumento(detalleSelect.instrumento);
                    setSearchTerm(detalleSelect.instrumento.instrumento); // Asigna el nombre del instrumento al campo de búsqueda
                    console.log(selectedInstrumento);
                } else {
                    setTxtValidacion(
                        "No se encontró el detalle con el ID proporcionado."
                    );
                }
            } catch (error) {
                setTxtValidacion("Error al obtener los datos del detalle del pedido.");
                console.error(error);
            }
        }
    };

    const handleInstrumentoChange = (instrumento: Instrumento) => {
        setSelectedInstrumento(instrumento);
        setDetPedidoObjeto((prev) => ({ ...prev, instrumento }));
        setSearchTerm(instrumento.instrumento); // Actualiza el campo de texto con el nombre seleccionado
        setIsDropdownOpen(false); // Cierra el desplegable después de seleccionar un instrumento
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Filtra los instrumentos en base al texto de búsqueda
        const filtered = instrumentos.filter((instrumento) =>
            instrumento.instrumento.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredInstrumentos(filtered);

        // Abre el desplegable si el usuario está escribiendo
        setIsDropdownOpen(true);
    };

    const handleSearchFocus = () => {
        setIsDropdownOpen(true); // Abre el desplegable al hacer clic en el campo de búsqueda
    };

    const save = async () => {
        // Función de guardar
    };


    return (
        <>
            <Form className="formulario-contenedor">
                <Row>
                    <Col mb={6}>
                        <FormGroup>
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl
                                type="number"
                                id="txtCantidad"
                                placeholder="Ingrese la cantidad"
                                value={detPedidoObjeto.cantidad || ""}
                                onChange={(e) =>
                                    setDetPedidoObjeto({
                                        ...detPedidoObjeto,
                                        cantidad: Number(e.target.value),
                                    })
                                }
                            />
                        </FormGroup>
                    </Col>
                    <Col mb={6}>
                        <FormGroup controlId="searchInstrumento">
                            <FormLabel>Instrumento</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Seleccione un instrumento"
                                value={searchTerm} // Muestra el nombre del instrumento seleccionado si ya existe
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus} // Abre el combo box al hacer clic en el campo de texto
                            />

                            {isDropdownOpen && filteredInstrumentos.length > 0 && (
                                <ListGroup
                                    style={{
                                        position: "absolute",
                                        zIndex: 1,
                                        width: "100%",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {filteredInstrumentos.map((instrumento) => (
                                        <ListGroup.Item
                                            key={instrumento.id}
                                            action
                                            onClick={() => handleInstrumentoChange(instrumento)}
                                        >
                                            {instrumento.instrumento}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <div className="mb-12">
                    <p style={{ color: "red" }}>{txtValidacion}</p>
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
                            onClick={() => navigate(`/detallePedido/${detPedidoObjeto.pedido.id}`)}
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
        </>
    );

}

export default FormularioDetallPedido;