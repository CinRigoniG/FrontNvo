import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Empresa from "../../entities/Empresa";
import EmpresaService from "../../services/EmpresaService";
import ModalConfirmacion from "../Modales/ModalConfirmacion";
import "./Grillas.css";

const EmpresaSucursal = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [empresaAEliminar, setEmpresaAEliminar] = useState<Empresa | null>(
    null
  );
  const empresaService = new EmpresaService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const empresasData = await empresaService.getAll(url + "empresa");
      setEmpresas(empresasData);
    };
    fetchData();
  }, []);

  const verSucursales = (idEmpresa: number) => {
    navigate(`/sucursales/${idEmpresa}`);
  };

  const abrirModalEliminar = (empresa: Empresa) => {
    setEmpresaAEliminar(empresa);
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setEmpresaAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (empresaAEliminar?.id !== undefined) {
      await empresaService.delete(url + "empresa", empresaAEliminar.id);
      setModalIsOpen(false);
      setEmpresaAEliminar(null);
      window.location.reload();
    }
  };

  const agregarEmpresa = () => {
    navigate("/formularioEmpresa/0");
  };

  const editarEmpresa = (idEmpresa: number) => {
    navigate(`/formularioEmpresa/${idEmpresa}`);
  };

  return (
    <Container fluid className="mt-4">
      <Row className="row-centrado">
        <Button
          variant="success"
          onClick={agregarEmpresa}
          className="botones-grilla"
        >
          Agregar empresa
        </Button>
      </Row>

      <Row>
        <Col md={6}>
          {empresas.map((empresa) => (
            <Card className="mb-4" key={empresa.id}>
              <Row>
                <Col md={4}>
                  <div className="card-img-container">
                    <Card.Img
                      className="card-img"
                      variant="top"
                      src={`/images/${empresa.imagenEmpresa}`}
                      alt={`${empresa.nombre} imagen`}
                    />
                  </div>
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title className="tituloEmpresa">{empresa.nombre}</Card.Title>
                    <Card.Text>CUIT: {empresa.cuit}</Card.Text>
                    <Card.Text>Razón social: {empresa.razonSocial}</Card.Text>
                    <Card.Text>{empresa.gmail}</Card.Text>
                    <Card.Text>{empresa.telefono}</Card.Text>
                    <Button
                      className="btn-ver-sucursales"
                      onClick={() => verSucursales(empresa.id!)}
                    >
                      Ver Sucursales
                    </Button>

                    <Button
                      className="bi bi-pencil icono-editar"
                      variant="link"
                      style={{ color: "blue", textDecoration: "underline" }}
                      onClick={() => editarEmpresa(empresa.id!)}
                    >
                    </Button>
                    <Button
                      className="bi bi-trash icono-borrar"
                      variant="link"
                      style={{ color: "red", textDecoration: "underline" }}
                      onClick={() => abrirModalEliminar(empresa)}
                    >
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
      </Row>

      <ModalConfirmacion
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        onConfirm={confirmarEliminar}
        contentLabel="Confirmar eliminación"
      />
    </Container>
  );
};

export default EmpresaSucursal;
