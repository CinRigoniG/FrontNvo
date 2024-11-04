import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sucursal } from "../../entities/Sucursal";
import SucursalService from "../../services/SucursalService";
import { useUser } from "../../context/UserContext";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import EmpresaService from "../../services/EmpresaService";
import DomicilioService from "../../services/DomicilioService";

const FormularioSucursal = () => {

    const navigate = useNavigate();
    const { idSucursal = '0', idEmpresa = '0' } = useParams();
    const sucursalId = parseInt(idSucursal, 10);
    const empresaId = parseInt(idEmpresa, 10);
    const [sucursalObjeto, setSucursalObjeto] = useState<Sucursal>(new Sucursal());
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const sucursalService = new SucursalService();
    const empresaService = new EmpresaService();
    const domicilioService = new DomicilioService();

    const { usuarioL } = useUser();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        console.log(usuarioL);
        const fetchData = async () => {
            await getSucursal();
            if (empresaId > 0) {
                const empresa = await empresaService.get(url + 'empresa', empresaId);
                setSucursalObjeto((prev) => ({ ...prev, empresa }));
            }
        }
        fetchData();
    }, [idSucursal, idEmpresa])

    const getSucursal = async () => {
        if (sucursalId > 0) {
            try {
                const sucursalSelect = await sucursalService.get(url + 'sucursal', sucursalId);
                setSucursalObjeto(sucursalSelect || new Sucursal());
                if (!sucursalSelect) setTxtValidacion("No se encontró sucursal con el ID proporcionado");
            } catch (error) {
                setTxtValidacion("Error al obtener los datos de la sucursal.");
                console.error(error);
            }
        } else {
            setSucursalObjeto(new Sucursal());
        }
    }

    const save = async () => {
        const {
            nombre,
            horarioApertura,
            horarioCierre,
            numeroSucursal,
            domicilio,
            empresa
        } = sucursalObjeto;

        if (!nombre) setTxtValidacion("Ingrese el nombre de la sucursal");
        else if (!horarioApertura) setTxtValidacion("Ingrese el horario de apertura");
        else if (!horarioCierre) setTxtValidacion("Ingrese el horario de cierre");
        else if (!numeroSucursal || numeroSucursal <= 0)
            setTxtValidacion("Ingrese un número de sucursal válido");
        else if (!domicilio || !domicilio.calle || !domicilio.numero)
            setTxtValidacion("Complete el domicilio de la sucursal");
        else if (!empresa) setTxtValidacion("No se ha asociado una empresa válida");
        else {
            try {
                const domicilioNuevo = await domicilioService.post(url + 'domicilio', domicilio);

                const sucursalConDomicilio = { ...sucursalObjeto, domicilio: domicilioNuevo };

                if (idSucursal !== "0") {
                    await sucursalService.put(url + "sucursal", sucursalId, sucursalConDomicilio);
                } else {
                    await sucursalService.post(url + "sucursal", sucursalConDomicilio);
                }
                navigate("/empresaSucursal");
            } catch (error) {
                console.error("Error al guardar la sucursal:", error);
            }
        }
    };

    return (
        <>
            <Form className="formulario-contenedor">
                <Row>
                    <FormGroup>
                        <h5>Datos de la sucursal</h5>
                    </FormGroup>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Nombre Sucursal</FormLabel>
                            <FormControl
                                type="text"
                                id="txtNombre"
                                placeholder="Ingrese el nombre de la sucursal"
                                value={sucursalObjeto.nombre || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    nombre: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Horario de apertura</FormLabel>
                            <FormControl
                                type="text"
                                id="txtHorarioApertura"
                                placeholder="HH:mm"
                                value={sucursalObjeto.horarioApertura || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    horarioApertura: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Horario de cierre</FormLabel>
                            <FormControl
                                type="text"
                                id="txtHorarioCierre"
                                placeholder="HH:mm"
                                value={sucursalObjeto.horarioCierre || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    horarioCierre: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Número de Sucursal</FormLabel>
                            <FormControl
                                type="number"
                                id="txtNumeroSucursal"
                                placeholder="Ingrese el número de la sucursal"
                                value={sucursalObjeto.numeroSucursal || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    numeroSucursal: Number(e.target.value)
                                })}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {/* Campos de Domicilio */}
                <Row>
                    <FormGroup>
                        <h5>Domicilio de la sucursal</h5>
                    </FormGroup>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Calle</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese la calle del domicilio"
                                value={sucursalObjeto.domicilio?.calle || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        calle: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Número</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese el número de domicilio"
                                value={sucursalObjeto.domicilio?.numero || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        numero: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Departamento</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese el departamento de domicilio"
                                value={sucursalObjeto.domicilio?.departamento || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        departamento: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Piso</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese el piso de domicilio"
                                value={sucursalObjeto.domicilio?.piso || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        piso: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Barrio</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese el barrio de domicilio"
                                value={sucursalObjeto.domicilio?.barrio || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        barrio: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">CP</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese el código postal del domicilio"
                                value={sucursalObjeto.domicilio?.codigoPostal || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        codigoPostal: Number(e.target.value)
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Localidad</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese la localidad de domicilio"
                                value={sucursalObjeto.domicilio?.localidad || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        localidad: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Provincia</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese la provincia de domicilio"
                                value={sucursalObjeto.domicilio?.provincia || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        provincia: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Pais</FormLabel>
                            <FormControl
                                type="text"
                                placeholder="Ingrese el pais del domicilio"
                                value={sucursalObjeto.domicilio?.pais || ""}
                                onChange={(e) => setSucursalObjeto({
                                    ...sucursalObjeto,
                                    domicilio: {
                                        ...sucursalObjeto.domicilio,
                                        pais: e.target.value
                                    }
                                })}
                            />
                        </FormGroup>
                    </Col>
                </Row>

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
                            onClick={() => navigate("/empresaSucursal")}
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
    )
}

export default FormularioSucursal;