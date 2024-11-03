import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Persona from "../../entities/Persona";
import { useEffect, useState } from "react";
import PersonaService from "../../services/PersonaService";
import { Roles } from "../../entities/Enums/Roles";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import Domicilio from "../../entities/Domicilio";
import FormularioDomicilio from "./FormularioDomicilio";
import "./Fromularios.css";
import UsuarioService from "../../services/UsuarioService";

const FormularioPersona = () => {
  const navigate = useNavigate();
  const { usuarioId = "0" } = useParams();
  const { usuarioL } = useUser(); // Usuario logueado contexto
  const [personaObjeto, setPersonaObjeto] = useState<Persona>({
    ...new Persona(),
    fechaNacimiento: new Date("2024-01-01"),
    domicilios: [],
  });
  const [txtValidacion, setTxtValidacion] = useState<string>("");
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const personaService = new PersonaService();
  const usuarioService = new UsuarioService();
  const url = import.meta.env.VITE_API_URL;

  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const updateFechaNacimiento = (newYear: number, newMonth: number, newDay: number) => {
    const fechaNacimiento = new Date(newYear, newMonth - 1, newDay);
    setPersonaObjeto((prev) => ({ ...prev, fechaNacimiento }));
  };


  useEffect(() => {
    console.log(usuarioId);
    const fetchData = async () => {
      await getPersonaByUsuarioId();
    };
    const fetchUsuario = async () => {
      try {
        const usuarioData = await usuarioService.get(
          url + "usuario",
          parseInt(usuarioId, 10)
        );
        if (usuarioData) {
          setNombreUsuario(usuarioData.nombre);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (usuarioId) {
      fetchUsuario();
    }

    fetchData();
  }, [usuarioId]);

  const getPersonaByUsuarioId = async () => {
    if (usuarioId) {
      try {
        const personaSelect = await personaService.getPersonaByUsuarioId(
          url + "persona",
          parseInt(usuarioId, 10)
        );
        if (personaSelect) {
          console.log(personaSelect);
          setPersonaObjeto(personaSelect);
          if (personaSelect.fechaNacimiento) {
            const fecha = new Date(personaSelect.fechaNacimiento);
            setDay(fecha.getDate());
            setMonth(fecha.getMonth() + 1);
            setYear(fecha.getFullYear());
          }
        } else {
          setPersonaObjeto(new Persona()); // Crear una nueva instancia si no existe
        }
      } catch (error) {
        setTxtValidacion("Error al obtener los datos de la persona.");
        console.error(error);
      }
    }
  };

  

  const save = async () => {
    const selectedDate = new Date(year, month - 1, day);
    setPersonaObjeto((prev) => ({ ...prev, fechaNacimiento: selectedDate }));
    console.log(personaObjeto);
    try {
        // Validaciones
      if (!personaObjeto.nombre) {
        setTxtValidacion("El nombre del usuario no puede estar vacío.");
        return;
      }
      if (!personaObjeto.apellido) {
        setTxtValidacion("El apellido del usuario no puede estar vacío.");
        return;
      }
      if (
        !personaObjeto.email ||
        !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(personaObjeto.email)
      ) {
        setTxtValidacion("Ingrese un email válido.");
        return;
      }
      if (!personaObjeto.telefono || personaObjeto.telefono.length < 8) {
        setTxtValidacion("Ingrese un teléfono válido.");
        return;
      }

        // Guardar
      let result;
      if (personaObjeto.id) {
        result = await personaService.put(
          url + "persona",
          personaObjeto.id,
          personaObjeto
        );
      } else {
        personaObjeto.usuario = await usuarioService.get(
          url + "usuario",
          parseInt(usuarioId, 10)
        );
        result = await personaService.post(url + "persona", personaObjeto);
      }
      if (result && usuarioL?.nombreRol === Roles.ADMIN) {
        navigate("/grillaUsuarios");
      } else if (result) {
        navigate("/login");
      } else {
        setTxtValidacion("No se pudo guardar el usuario, intente nuevamente.");
      }
    } catch (error) {
      setTxtValidacion("Error al guardar los datos.");
      console.error(error);
    }
  };

  const addDomicilio = () => {
    setPersonaObjeto((prev) => ({
      ...prev,
      domicilios: [...prev.domicilios, new Domicilio()],
    }));
  };

  const removeDomicilio = (index: number) => {
    setPersonaObjeto((prev) => ({
      ...prev,
      domicilios: prev.domicilios.filter((_, i) => i !== index),
    }));
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
                id="txtNombrePersona"
                placeholder="Ingrese el nombre de la persona"
                value={personaObjeto.nombre || ""}
                onChange={(e) =>
                  setPersonaObjeto({
                    ...personaObjeto,
                    nombre: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel>Apellido</FormLabel>
              <FormControl
                type="text"
                id="txtApellidoPersona"
                placeholder="Ingrese el apellido de la persona"
                value={personaObjeto.apellido || ""}
                onChange={(e) =>
                  setPersonaObjeto({
                    ...personaObjeto,
                    apellido: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <div style={{ display: "flex", gap: "5px" }}>
                <Form.Control
                  as="select"
                  value={day}
                  onChange={(e) => {
                    const newDay = Number(e.target.value);
                    setDay(newDay);
                    // Actualiza el objeto con la fecha nueva
                    updateFechaNacimiento(year, month, newDay);
                  }}
                >
                  {[...Array(31)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Form.Control>

                <Form.Control
                  as="select"
                  value={month}
                  onChange={(e) => {
                    const newMonth = Number(e.target.value);
                    setMonth(newMonth);
                    // Actualiza el objeto con la fecha nueva
                    updateFechaNacimiento(year, newMonth, day);
                  }}
                >
                  {[
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                  ].map((mes, i) => (
                    <option key={i} value={i + 1}>
                      {mes}
                    </option>
                  ))}
                </Form.Control>

                <Form.Control
                  as="select"
                  value={year}
                  onChange={(e) => {
                    const newYear = Number(e.target.value);
                    setYear(newYear);
                    // Actualiza el objeto con la fecha nueva
                    updateFechaNacimiento(newYear, month, day);
                  }}
                >
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormControl
                type="text"
                id="txtEmailPersona"
                placeholder="Ingrese el email de la persona"
                value={personaObjeto.email || ""}
                onChange={(e) =>
                  setPersonaObjeto({
                    ...personaObjeto,
                    email: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel>Telefono</FormLabel>
              <FormControl
                type="text"
                id="txtTelefonoPersona"
                placeholder="Ingrese el telefono de la persona"
                value={personaObjeto.telefono || ""}
                onChange={(e) =>
                  setPersonaObjeto({
                    ...personaObjeto,
                    telefono: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <FormLabel>Usuario</FormLabel>
              <Form.Control
                type="text"
                id="txtUsuarioPersona"
                placeholder="Ingrese el usuario de la persona"
                value={nombreUsuario}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="row-boton">
          <Button className="btn-anadir-domicilio" onClick={addDomicilio}>
            Añadir Domicilio
          </Button>
          {personaObjeto.domicilios.map((domicilio, index) => (
            <FormularioDomicilio
              key={index}
              domicilio={domicilio}
              onRemove={() => removeDomicilio(index)}
              onChange={(updatedDomicilio: Domicilio) => {
                const updatedDomicilios = [...personaObjeto.domicilios];
                updatedDomicilios[index] = updatedDomicilio;
                setPersonaObjeto((prev) => ({
                  ...prev,
                  domicilios: updatedDomicilios,
                }));
              }}
            />
          ))}
        </Row>
        <div className="mb-12">
          <p className="text-danger">{txtValidacion}</p>
        </div>
        <Row className="d-flex justify-content-center">
          <Col md={6} className="d-flex justify-content-center">
            <Button className="btn btn-guardarDatos" onClick={save}>
              Guardar
            </Button>
          </Col>
          <Col md={6} className="d-flex justify-content-center">
            <Button className="btn btn-volverForm" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default FormularioPersona;
