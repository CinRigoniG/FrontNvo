import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import Categoria from "../../entities/Categoria";
import InstrumentoService from "../../services/InstrumentoService";
import CategoriaService from "../../services/CategoriaService";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";

const FormularioInstrumento = () => {

    const navigate = useNavigate();
    const { idInstrumento = "0" } = useParams();
    const instrumentoId = idInstrumento ? parseInt(idInstrumento, 10) : 0;

    const [instrumentoObjeto, setInstrumentoObjeto] = useState<Instrumento>(
        new Instrumento()
    );
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const instrumentoService = new InstrumentoService();
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            await getCategorias();
            await getInstrumento();
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

    const getInstrumento = async () => {
        console.log(idInstrumento);
        if (instrumentoId > 0) {
            try {
                const instrumentoId = parseInt(idInstrumento, 10);
                const instrumentoSelect = await instrumentoService.get(
                    url + "instrumento",
                    instrumentoId
                );
                if (instrumentoSelect) {
                    setInstrumentoObjeto(instrumentoSelect);
                    console.log(instrumentoSelect);
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
        if (!instrumento || instrumento === "")
            setTxtValidacion("Ingrese el nombre del instrumento");
        else if (!marca || marca === "")
            setTxtValidacion("Ingrese la marca del instrumento");
        else if (!modelo || modelo === "")
            setTxtValidacion("Ingrese el modelo del instrumento");
        else if (precio === 0)
            setTxtValidacion("El precio debe ser distinto de cero");
        else if (!imagen || imagen === "")
            setTxtValidacion("Por favor, seleccione una imagen");
        else if (!descripcion || descripcion === "")
            setTxtValidacion("Ingrese una descripción del instrumento");
        else if (!categoria || categoria.denominacion === "")
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
                        parseInt(idInstrumento, 10),
                        instrumentoObjeto
                    );
                } else {
                    await instrumentoService.post(url + "instrumento", instrumentoObjeto);
                }
                navigate("/grilla");
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
            <Form>
                <FormGroup>
                    <FormLabel htmlFor="txtNombre">Instrumento</FormLabel>
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
                <FormGroup>
                    <FormLabel htmlFor="txtMarca">Marca</FormLabel>
                    <FormControl
                        type="text"
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
            </Form>
        </>
    );

}

export default FormularioInstrumento;