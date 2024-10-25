import { Form, InputGroup, Table, Image, Button, Row } from "react-bootstrap"
import Instrumento from "../../entities/Instrumento";
import { useEffect, useState } from "react";
import Categoria from "../../entities/Categoria";
import InstrumentoService from "../../services/InstrumentoService";
import CategoriaService from "../../services/CategoriaService";
import { useUser } from "../../context/UserContext";
import { Roles } from "../../entities/Roles";
import { Link } from "react-router-dom";
import ModalConfirmacion from "../Modales/ModalConfirmacion";

const GrillaInstrumentos = () => {

    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [instrumentoAEliminar, setInstrumentoAEliminar] = useState<Instrumento | null>(null);

    const instrumentoService = new InstrumentoService();
    const categoriaService = new CategoriaService();
    const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const instrumentosData = await instrumentoService.getAll(url + "instrumento");
            setInstrumentos(instrumentosData);
        };
        fetchData();
    }, [categoriaSeleccionada]);

    useEffect(() => {
        const fetchCategorias = async () => {
            const categoriasData = await categoriaService.getAll(url + "categoria");
            setCategorias(categoriasData);
        };
        fetchCategorias();
    }, []);

    const filtrarPorCategoriaYBusqueda = (instrumento: Instrumento) => {
        const filtroPorCategoria = !categoriaSeleccionada || instrumento.categoria?.id === categoriaSeleccionada;
        const filtroPorBusqueda = instrumento.instrumento.toLowerCase().includes(busqueda.toLowerCase());
        return filtroPorCategoria && filtroPorBusqueda;
    };

    const abrirModalEliminar = (instrumento: Instrumento) => {
        setInstrumentoAEliminar(instrumento);
        setModalIsOpen(true);
    };

    const cerrarModal = () => {
        setModalIsOpen(false);
        setInstrumentoAEliminar(null);
    };

    const confirmarEliminar = async () => {
        if (instrumentoAEliminar) {
            await instrumentoService.delete(url + "instrumento", instrumentoAEliminar.id);
            setModalIsOpen(false);
            setInstrumentoAEliminar(null);
            window.location.reload();
        }
    };

    return (
        <>

            <InputGroup className="mb-2">
                <Form.Select onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}>
                    <option value="">Mostrar Todos</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.denominacion}
                        </option>
                    ))}
                </Form.Select>
                <Form.Control
                    type="text"
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)} />
            </InputGroup>
            <Row>
                {usuarioL?.nombreRol === Roles.ADMIN && (
                    <>
                        <Button href="/formulario/0">
                            Nuevo Instrumento
                        </Button>
                    </>
                )}
            </Row>

            <Table>
                <thead>
                    <tr>
                        <th>Instrumento</th>
                        <th>Imagen</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Costo de envío</th>
                        <th>Cantidad ventida</th>
                        {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
                        {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {instrumentos
                        .filter(filtrarPorCategoriaYBusqueda)
                        .map((instrumento, index) => (
                            <tr key={index}>
                                <td>{instrumento.instrumento}</td>
                                <td>
                                    <Image
                                        src={`./images/${instrumento.imagen}`}
                                        alt={instrumento.instrumento}
                                        style={{ width: "100px", height: "100px" }} />
                                </td>
                                <td>{instrumento.descripcion}</td>
                                <td>{instrumento.categoria
                                    ? instrumento.categoria.denominacion
                                    : "Sin Categoría"}</td>
                                <td>{instrumento.costoEnvio === "G"
                                    ? "Envío gratis"
                                    : `$${instrumento.costoEnvio}`}</td>
                                <td>{instrumento.cantidadVendida}</td>
                                {usuarioL?.nombreRol === Roles.ADMIN && (
                                    <>
                                        <td>
                                            <Link to={`/formulario/${instrumento.id}`}>
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                        </td>
                                        <td>
                                            <i
                                                className="bi bi-trash"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => abrirModalEliminar(instrumento)}
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
                contentLabel="Confirmar eliminación"
            />
        </>
    );
}

export default GrillaInstrumentos