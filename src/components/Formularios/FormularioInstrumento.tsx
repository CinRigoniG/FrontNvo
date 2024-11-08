import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import Categoria from "../../entities/Categoria";
import InstrumentoService from "../../services/InstrumentoService";
import CategoriaService from "../../services/CategoriaService";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Col,
  FormSelect,
} from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import { Sucursal } from "../../entities/Sucursal";
import SucursalService from "../../services/SucursalService";

const FormularioInstrumento = () => {
  const navigate = useNavigate();
  const { idInstrumento = "0" } = useParams();
  const instrumentoId = idInstrumento ? parseInt(idInstrumento, 10) : 0;
  const [instrumentoObjeto, setInstrumentoObjeto] = useState<Instrumento>(
    new Instrumento()
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [txtValidacion, setTxtValidacion] = useState<string>("");
  const instrumentoService = new InstrumentoService();
  const categoriaService = new CategoriaService();
  const sucursalService = new SucursalService();
  const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log(usuarioL);
    const fetchData = async () => {
      await getCategorias();
      await getInstrumento();
      await getSucursales();
    };
    fetchData();
  }, [idInstrumento]);

  const getCategorias = async () => {
    try {
      setCategorias(await categoriaService.getAll(url + "categoria"));
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const getSucursales = async () => {
    try{
      setSucursales(await sucursalService.getAll(url + 'sucursal'))
    }catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  }

  const getInstrumento = async () => {
    if (instrumentoId > 0) {
      try {
        const instrumentoSelect = await instrumentoService.get(
          url + "instrumento",
          instrumentoId
        );
        if (instrumentoSelect) {
          setInstrumentoObjeto(instrumentoSelect);
        } else {
          setTxtValidacion(
            "No se encontró el instrumento con el ID proporcionado."
          );
        }
      } catch (error) {
        setTxtValidacion("Error al obtener los datos del instrumento.");
        console.error(error);
      }
    } else {
      setInstrumentoObjeto(new Instrumento());
    }
  };

  const save = async () => {
    const {
      instrumento,
      marca,
      modelo,
      imagen,
      precio,
      descripcion,
      categoria,
      costoEnvio,
    } = instrumentoObjeto;

    if (!instrumento) setTxtValidacion("Ingrese el nombre del instrumento");
    else if (!marca) setTxtValidacion("Ingrese la marca del instrumento");
    else if (!modelo) setTxtValidacion("Ingrese el modelo del instrumento");
    else if (precio === 0)
      setTxtValidacion("El precio debe ser distinto de cero");
    else if (!imagen) setTxtValidacion("Por favor, seleccione una imagen");
    else if (!descripcion)
      setTxtValidacion("Ingrese una descripción del instrumento");
    else if (!categoria || !categoria.denominacion)
      setTxtValidacion("Ingrese la categoría del instrumento");
    else if (!isValidCostoEnvio(costoEnvio))
      setTxtValidacion(
        'El costo de envío ingresado no es válido. Ingrese "Gratis" o un número'
      );
    else {
      try {
        if (idInstrumento !== "0") {
          await instrumentoService.put(
            url + "instrumento",
            instrumentoId,
            instrumentoObjeto
          );
        } else {
          await instrumentoService.post(url + "instrumento", instrumentoObjeto);
        }
        navigate("/grillaInstrumentos");
      } catch (error) {
        console.error("Error al guardar el instrumento:", error);
      }
    }
  };

  const isValidCostoEnvio = (costoEnvio: string) => {
    const costoEnvioMin = costoEnvio.trim().toLowerCase();
    if (/^\d+$/.test(costoEnvioMin) || costoEnvioMin === "gratis") {
      instrumentoObjeto.costoEnvio =
        costoEnvioMin === "gratis" ? "G" : costoEnvioMin;
      return true;
    }
    return false;
  };

  return (
    <>
      <Form className="formulario-contenedor">
        <Row>
          <Col md={6}>
            <FormGroup>
              <FormLabel className="text-center">Instrumento</FormLabel>
              <FormControl
                type="text"
                id="txtNombre"
                placeholder="Ingrese el nombre del instrumento"
                value={instrumentoObjeto.instrumento || ""}
                onChange={(e) =>
                  setInstrumentoObjeto({
                    ...instrumentoObjeto,
                    instrumento: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel className="text-center">Marca</FormLabel>
              <FormControl
                type="text"
                id="txtMarca"
                placeholder="Ingrese la marca"
                value={instrumentoObjeto.marca || ""}
                onChange={(e) =>
                  setInstrumentoObjeto({
                    ...instrumentoObjeto,
                    marca: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <FormLabel className="text-center">Modelo</FormLabel>
              <FormControl
                type="text"
                id="txtModelo"
                placeholder="Ingrese el modelo"
                value={instrumentoObjeto.modelo || ""}
                onChange={(e) =>
                  setInstrumentoObjeto({
                    ...instrumentoObjeto,
                    modelo: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel className="text-center">Precio</FormLabel>
              <FormControl
                type="text"
                id="txtPrecio"
                placeholder="Ingrese el precio"
                value={instrumentoObjeto.precio || ""}
                onChange={(e) =>
                  setInstrumentoObjeto({
                    ...instrumentoObjeto,
                    precio: Number(e.target.value),
                  })
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <FormLabel className="text-center">Imagen</FormLabel>
              <FormControl
                type="text"
                id="txtImagen"
                placeholder="Ingrese la imagen"
                value={instrumentoObjeto.imagen || ""}
                onChange={(e) =>
                  setInstrumentoObjeto({
                    ...instrumentoObjeto,
                    imagen: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel className="text-center">Costo de envío</FormLabel>
              <FormControl
                type="text"
                id="txtCostoEnvio"
                placeholder="Ingrese el costo de envío"
                value={instrumentoObjeto.costoEnvio || ""}
                onChange={(e) =>
                  setInstrumentoObjeto({
                    ...instrumentoObjeto,
                    costoEnvio: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <FormLabel className="text-center">Descripción</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            id="txtDescripcion"
            placeholder="Ingrese la descripción"
            value={instrumentoObjeto.descripcion || ""}
            onChange={(e) =>
              setInstrumentoObjeto({
                ...instrumentoObjeto,
                descripcion: e.target.value,
              })
            }
          />
        </FormGroup>
        <FormGroup>
          <FormLabel className="text-center">Categoría</FormLabel>
          <Form.Select
            id="selectCategoria"
            value={instrumentoObjeto.categoria?.id || ""}
            onChange={(e) => {
              const categoriaId = parseInt(e.target.value);
              const categoriaSeleccionada = categorias.find(
                (categoria) => categoria.id === categoriaId
              );
              if (categoriaSeleccionada) {
                setInstrumentoObjeto({
                  ...instrumentoObjeto,
                  categoria: categoriaSeleccionada,
                });
              } else {
                console.error("No se encontró la categoría seleccionada.");
              }
            }}
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.denominacion}
              </option>
            ))}
          </Form.Select>
        </FormGroup>
        <FormGroup>
          <FormLabel className="text-center">Sucursal</FormLabel>
          <FormSelect
            id="selectSucursal"
            value={instrumentoObjeto.sucursal?.id || ""}
            onChange={(e) => {
              const sucursalId = parseInt(e.target.value);
              const sucursalSeleccionada = sucursales.find(
                (sucursal) => sucursal.id === sucursalId
              );
              if(sucursalSeleccionada){
                setInstrumentoObjeto({
                  ...instrumentoObjeto,
                  sucursal: sucursalSeleccionada
                });
              }else{
                console.log("No se encontró la sucursal seleccionada.")
              }
            }}
          >
            <option value="">Seleccione una sucursal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <p style={{ color: "red" }}>{txtValidacion}</p>
        </FormGroup>
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
              onClick={() => navigate(-1)}
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
};

export default FormularioInstrumento;
