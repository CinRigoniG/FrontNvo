import { useEffect, useState } from "react";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import Categoria from "../../entities/Categoria";
import CategoriaService from "../../services/CategoriaService";
import './Instrumentos.css';
import ItemInstrumento from "../itemInstrumento/ItemInstrumento";
import { Col, Container, Form, Row } from "react-bootstrap";

const Instrumentos = () => {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
    const [busqueda, setBusqueda] = useState<string>("");
    const [orden, setOrden] = useState<string>(""); // Estado para el orden

    const instrumentoService = new InstrumentoService();
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const instrumentosData = await instrumentoService.getAll(url + 'instrumento');
            setInstrumentos(instrumentosData);
        };
        fetchData();
    }, [categoriaSeleccionada]);

    useEffect(() => {
        const fetchCategorias = async () => {
            const categoriasData = await categoriaService.getAll(url + 'categoria');
            setCategorias(categoriasData);
        };
        fetchCategorias();
    }, []);

    const filtrarPorCategoria = (instrumento: Instrumento) => {
        if (!categoriaSeleccionada) {
            return true;
        }
        return instrumento.categoria?.id === categoriaSeleccionada;
    };

    const filtrarPorBusqueda = (instrumento: Instrumento) => {
        if (!busqueda) {
            return true;
        }
        const term = busqueda.toLowerCase();
        return (
            instrumento.instrumento.toLowerCase().includes(term) ||
            instrumento.marca.toLowerCase().includes(term) ||
            instrumento.modelo.toLowerCase().includes(term) ||
            instrumento.descripcion.toLowerCase().includes(term)
        );
    };

    const ordenarInstrumentos = (a: Instrumento, b: Instrumento) => {
        if (orden === "asc") {
            return a.precio - b.precio; // Ordenar de mayor a menor
        } else if (orden === "desc") {
            return b.precio - a.precio; // Ordenar de menor a mayor
        }
        return 0; // Sin ordenamiento
    };

    return (
        <Row style={{ height: '100vh' }}>
            <Col xs={12}>
                <Container className="container-intrumentos">
                    <div className="cont-buscar">
                        <Form.Select  
                            value={categoriaSeleccionada !== null ? categoriaSeleccionada : ""} 
                            onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
                        >
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
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
    
                        <Form.Select 
                            value={orden} 
                            onChange={(e) => setOrden(e.target.value)}
                        >
                            <option value="">Ordenar por Precio</option>
                            <option value="desc">Mayor a Menor</option>
                            <option value="asc">Menor a Mayor</option>
                        </Form.Select>
                    </div>
    
                    <Row className="container-intrumentos">
                        {instrumentos
                            .filter(filtrarPorCategoria)
                            .filter(filtrarPorBusqueda)
                            .sort(ordenarInstrumentos)
                            .map((instrumento, index) => (
                                <ItemInstrumento
                                    key={index}
                                    instrumentoObject={instrumento}
                                    id={instrumento.id}
                                    instrumento={instrumento.instrumento}
                                    precio={instrumento.precio}
                                    imagen={instrumento.imagen}
                                    descripcion={instrumento.descripcion}
                                    marca={instrumento.marca}
                                    modelo={instrumento.modelo}
                                    costoEnvio={instrumento.costoEnvio}
                                    cantidadVendida={instrumento.cantidadVendida}
                                    initialHayStock={true}
                                />
                            ))}
                    </Row>
                </Container>
            </Col>
        </Row>
    );
};

export default Instrumentos;
