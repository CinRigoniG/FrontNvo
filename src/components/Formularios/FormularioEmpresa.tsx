import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Empresa from "../../entities/Empresa";
import { useUser } from "../../context/UserContext";
import EmpresaService from "../../services/EmpresaService";
import SucursalService from "../../services/SucursalService";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import { Sucursal } from "../../entities/Sucursal";
import ModalConfirmacion from "../Modales/ModalConfirmacion";

const FormularioEmpresa = () => {

    const navigate = useNavigate();
    const { idEmpresa = '0' } = useParams();
    const empresaId = idEmpresa ? parseInt(idEmpresa, 10) : 0;
    const [empresaObjeto, setEmpresaObjeto] = useState<Empresa>(new Empresa());
    const [sucursalesEmpresa, setSucursalesEmpresa] = useState<Sucursal[]>([])
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sucursalAEliminar, setSucursalAEliminar] = useState<Sucursal | null>(null);
    const empresaService = new EmpresaService();
    const sucursalService = new SucursalService();

    const { usuarioL } = useUser();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        console.log(usuarioL);
        const fetchData = async () => {
            await getEmpresa();
            await getSucursales();
        }
        fetchData();
    }, [idEmpresa]);

    const getEmpresa = async () => {
        if (empresaId > 0) {
            try {
                const empresaSelect = await empresaService.get(url + 'empresa', empresaId);
                if (empresaSelect) {
                    setEmpresaObjeto(empresaSelect);
                } else {
                    setTxtValidacion("No se encontró empresa con el ID proporcionado")
                }
            } catch (error) {
                setTxtValidacion("Error al obtener los datos de la empresa.");
                console.error(error);
            }
        } else {
            setEmpresaObjeto(new Empresa());
        }
    }

    const getSucursales = async () => {
        try {
            const sucursalesData = await sucursalService.getByEmpresaId(url + 'sucursal', empresaId);
            setSucursalesEmpresa(sucursalesData);
        } catch (error) {
            setTxtValidacion("Esta empresa no posee sucursales.");
            console.error(error);
        }
    }

    const save = async () => {
        const {
            nombre,
            razonSocial,
            imagenEmpresa,
            cuit,
            telefono,
            gmail
        } = empresaObjeto;

        if (!nombre) setTxtValidacion("Ingrese el nombre de la empresa");
        else if (!razonSocial) setTxtValidacion("Ingrese la razón social de la empresa");
        else if (!imagenEmpresa) setTxtValidacion("Por favor, seleccione una imagen de la empresa");
        else if (!cuit || cuit.toString().length !== 11)
            setTxtValidacion("Ingrese un CUIT válido de 11 dígitos");
        else if (!telefono || telefono.toString().length < 6)
            setTxtValidacion("Ingrese un número de teléfono válido");
        else if (!gmail || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(gmail))
            setTxtValidacion("Ingrese un correo electrónico válido");
        else {
            try {
                if (idEmpresa !== "0") {
                    await empresaService.put(url + "empresa", empresaId, empresaObjeto);
                } else {
                    await empresaService.post(url + "empresa", empresaObjeto);
                }
                navigate("/empresaSucursal");
            } catch (error) {
                console.error("Error al guardar la empresa:", error);
            }
        }
    };

    const abrirModalEliminar = (sucursal: Sucursal) => {
        setSucursalAEliminar(sucursal);
        setModalIsOpen(true);
    };

    const cerrarModal = () => {
        setModalIsOpen(false);
        setSucursalAEliminar(null);
    };

    const confirmarEliminar = async () => {
        if (sucursalAEliminar?.id !== undefined) {
            await sucursalService.delete(
                url + "sucursal", sucursalAEliminar.id
            );
            setModalIsOpen(false);
            setSucursalAEliminar(null);
            window.location.reload();
        }
    };

    return (
        <>
            <Form className="formulario-contenedor">
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Nombre empresa</FormLabel>
                            <FormControl
                                type="text"
                                id="txtNombre"
                                placeholder="Ingrese el nombre de la empresa"
                                value={empresaObjeto.nombre || ""}
                                onChange={(e) => setEmpresaObjeto({
                                    ...empresaObjeto,
                                    nombre: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Razón social</FormLabel>
                            <FormControl
                                type="text"
                                id="txtRazonSocial"
                                placeholder="Ingrese la razón social de la empresa"
                                value={empresaObjeto.razonSocial || ""}
                                onChange={(e) => setEmpresaObjeto({
                                    ...empresaObjeto,
                                    razonSocial: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Imagen empresa</FormLabel>
                            <FormControl
                                type="text"
                                id="txtImagen"
                                placeholder="Ingrese la imagen de la empresa"
                                value={empresaObjeto.imagenEmpresa || ""}
                                onChange={(e) => setEmpresaObjeto({
                                    ...empresaObjeto,
                                    imagenEmpresa: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">CUIT empresa</FormLabel>
                            <FormControl
                                type="number"
                                id="txtCuit"
                                placeholder="Ingrese el cuit de la empresa"
                                value={empresaObjeto.cuit || ""}
                                onChange={(e) => setEmpresaObjeto({
                                    ...empresaObjeto,
                                    cuit: Number(e.target.value)
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Teléfono empresa</FormLabel>
                            <FormControl
                                type="text"
                                id="txtTelefono"
                                placeholder="Ingrese el teléfono de la empresa"
                                value={empresaObjeto.telefono || ""}
                                onChange={(e) => setEmpresaObjeto({
                                    ...empresaObjeto,
                                    telefono: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel className="text-center">Email empresa</FormLabel>
                            <FormControl
                                type="text"
                                id="txtEmail"
                                placeholder="Ingrese el email de la empresa"
                                value={empresaObjeto.gmail || ""}
                                onChange={(e) => setEmpresaObjeto({
                                    ...empresaObjeto,
                                    gmail: e.target.value
                                })}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <p style={{ color: "red" }}>{txtValidacion}</p>
                </FormGroup>

                {idEmpresa !== '0' && (
                    <>
                        <Row  className="row-boton">
                            <Button className="btn-anadir-algo"
                                onClick={() => navigate(`/FormularioSucursal/0/${idEmpresa}`)}
                                
                            >
                                Agregar Sucursal
                            </Button>
                        </Row>
                        {sucursalesEmpresa.length > 0 ? (
                            <Row>
                                <Table striped bordered hover>
                                    <thead className="grilla">
                                        <tr>
                                            <th>Nombre sucursal</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sucursalesEmpresa.map((sucursal, index) => (
                                            <tr key={index}>
                                                <td>{sucursal.nombre}</td>
                                                <td>
                                                    <Link to={`/formularioSucursal/${sucursal.id}`}>
                                                        <i className="bi bi-pencil icono-editar"></i>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <i
                                                        className="bi bi-trash icono-borrar"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => abrirModalEliminar(sucursal)}
                                                    ></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Row>
                        ) : (
                            <Row>
                                <p>Esta empresa no posee sucursales</p>
                            </Row>
                        )}
                    </>
                )}

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
            <ModalConfirmacion
                isOpen={modalIsOpen}
                onRequestClose={cerrarModal}
                onConfirm={confirmarEliminar}
                contentLabel="Confirmar eliminación"
            />
        </>
    )

}

export default FormularioEmpresa;