import { useEffect, useState } from "react";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import Categoria from "../../entities/Categoria";
import CategoriaService from "../../services/CategoriaService";
import "./Instrumentos.css";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import ItemInstrumento from "../ItemInstrumento/ItemInstrumento";

const Instrumentos = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | null
  >(null);
  const [busqueda, setBusqueda] = useState<string>("");
  const [orden, setOrden] = useState<string>(""); // Estado para el orden
  const [envioGratis, setEnvioGratis] = useState<boolean>(false); // Estado del checkbox

  const instrumentoService = new InstrumentoService();
  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const instrumentosData = await instrumentoService.getAll(
        url + "instrumento"
      );
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

  const filtrarPorEnvioGratis = (instrumento: Instrumento) => {
    if (!envioGratis) {
      return true;
    }
    return instrumento.costoEnvio === "G"; // Filtra los de envío gratis
  };

  const ordenarInstrumentos = (a: Instrumento, b: Instrumento) => {
    if (orden === "asc") {
      return a.precio - b.precio;
    } else if (orden === "desc") {
      return b.precio - a.precio;
    }
    return 0;
  };

  return (
    <>
      <Row className="filtros-container mb-3 w-100">
        <Col xs={3}>
          <Form.Select
            value={categoriaSeleccionada !== null ? categoriaSeleccionada : ""}
            onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
            className="filtro-select"
          >
            <option value="">Mostrar Todos</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.denominacion}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={3}>
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="filtro-busqueda"
          />
        </Col>

        <Col xs={3}>
          <Form.Select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="filtro-orden"
          >
            <option value="">Ordenar por Precio</option>
            <option value="desc">Mayor a Menor</option>
            <option value="asc">Menor a Mayor</option>
          </Form.Select>
        </Col>

        <Col xs={3} className="d-flex align-items-center">
          <Form.Check
            type="checkbox"
            label="Envío Gratis"
            checked={envioGratis}
            onChange={(e) => setEnvioGratis(e.target.checked)}
            className="filtro-envio-check"
          />
        </Col>
      </Row>

      <Row className="justify-content-center">
        {instrumentos
          .filter(filtrarPorCategoria)
          .filter(filtrarPorBusqueda)
          .filter(filtrarPorEnvioGratis)
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
    </>
  );
};

export default Instrumentos;
