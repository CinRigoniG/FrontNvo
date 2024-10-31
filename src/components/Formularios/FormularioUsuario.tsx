import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Roles } from "../../entities/Enums/Roles";
import Usuario from "../../entities/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";

const FormularioUsuario = () => {

    const navigate = useNavigate();
    const { idUsuario = '0' } = useParams();
    const usuarioId = idUsuario ? parseInt(idUsuario, 10) : 0;
    const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto
    const [usuarioObjeto, setUsuarioObjeto] = useState<Usuario>(new Usuario())
    const [txtValidacion, setTxtValidacion] = useState<String>('');
    const usuarioService = new UsuarioService();

    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            await getUsuario();
        };
        fetchData();
    }, [idUsuario]);

    const getUsuario = async () => {
        console.log(idUsuario);
        if (usuarioId > 0) {
            try {
                const usuarioId = idUsuario ? parseInt(idUsuario, 10) : 0;
                const usuarioSelect = await usuarioService.get(url + 'usuario', usuarioId);
                if (usuarioSelect) {
                    setUsuarioObjeto(usuarioSelect);
                    console.log(usuarioSelect);
                } else {
                    setTxtValidacion('No se encontro el usuario con el ID proporcionado.')
                }
            } catch (error) {
                setTxtValidacion('Error al obtener los datos del usuario.');
                console.error(error);
            }
        } else {
            setUsuarioObjeto(new Usuario());
        };
    };

    const save = async () => {
        try {
            console.log(usuarioObjeto);
            if (usuarioObjeto.nombre.length === 0) {
                setTxtValidacion('El nombre del usuario no puede estar vacio.');
                return;
            }
            if (usuarioObjeto.clave.length < 5) {
                setTxtValidacion('La clave debe tener más de 5 caracteres.');
                return;
            }
            if (usuarioObjeto.nombreRol.length === 0) {
                setTxtValidacion('El rol del usuario no puede estar vacio. Seleccione uno.');
                return;
            }
            console.log(`URL para POST: ${url}usuario`);
            let result;
            if (usuarioId > 0) {
                result = await usuarioService.put(url + 'usuario', usuarioId, usuarioObjeto);
            } else {
                result = await usuarioService.post(url + 'usuario', usuarioObjeto);
            }
            console.log('Resultado del POST:', result);
            if (result && usuarioL?.nombreRol === Roles.ADMIN) {
                navigate('/grillaUsuarios')
            } else if (result) {
                navigate('/login')
            } else {
                setTxtValidacion('No se pudo guardar el usuario, intente nuevamente.')
            }
        } catch (error) {
            setTxtValidacion('Error al guardar el usuario.');
            console.error(error);
        }
    };

    return (
        <>
            <Form className="formulario-contenedor">
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl
                                type="text"
                                id="txtNombreUsuario"
                                placeholder="Ingrese el nombre de usuario"
                                value={usuarioObjeto.nombre || ''}
                                onChange={(e) => setUsuarioObjeto({ ...usuarioObjeto, nombre: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel>Clave</FormLabel>
                            <FormControl
                                type="text"
                                id="txtClaveUsuario"
                                placeholder="Ingrese la clave de usuario"
                                value={usuarioObjeto.clave || ''}
                                onChange={(e) => setUsuarioObjeto({ ...usuarioObjeto, clave: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="row-centrado">
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel>Rol</FormLabel>
                            <FormSelect
                                id="selectRol"
                                value={usuarioObjeto.nombreRol || ''}
                                onChange={(e) => setUsuarioObjeto({ ...usuarioObjeto, nombreRol: e.target.value })}
                            >
                                <option value="" disabled>Seleccione un rol</option>
                                {usuarioL?.nombreRol === Roles.ADMIN ? (
                                    Object.values(Roles).map((rol) => (
                                        <option key={rol} value={rol}>{rol}</option>
                                    ))
                                ) : (
                                    <option value={Roles.OPERADOR}>{Roles.OPERADOR}</option> // Solo permite OPERADOR
                                )}
                            </FormSelect>
                        </FormGroup>
                    </Col>
                </Row>
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
                            onClick={() => navigate("/grillaUsuarios")}
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

export default FormularioUsuario;