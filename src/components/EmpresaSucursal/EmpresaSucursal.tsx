import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Empresa from '../../entities/Empresa';
import { useEffect, useState } from 'react';
import EmpresaService from '../../services/EmpresaService';
import { Sucursal } from '../../entities/Sucursal';
import SucursalService from '../../services/SucursalService';
import ModalConfirmacion from '../Modales/ModalConfirmacion';

const EmpresaSucursal = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [empresaAEliminar, setEmpresaAEliminar] = useState<Empresa | null>(null);
  const empresaService = new EmpresaService();
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const empresasData = await empresaService.getAll(url + 'empresa');
      setEmpresas(empresasData);
    };
    fetchData();
  }, []);

  const buscarSucursales = async (idEmpresa: number) => {
    const sucursalesData = await sucursalService.getByEmpresaId(url + 'sucursal', idEmpresa);
    if (sucursalesData) {
      setSucursales(sucursalesData);
    } else {
      setSucursales([]); // Limpiar las sucursales si no hay datos
    }
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
      await empresaService.delete(
        url + "empresa", empresaAEliminar.id
      );
      setModalIsOpen(false);
      setEmpresaAEliminar(null);
      window.location.reload();
    }
  };

  const agregarEmpresa = () => {
    navigate('/formularioEmpresa/0');
  };

  const editarEmpresa = (idEmpresa: number) => {
    navigate(`/formularioEmpresa/${idEmpresa}`);
  };

  const editarSucursal = (idSucursal: number) => {
    navigate(`/formularioSucursal/${idSucursal}`);
  };

  return (
    <>
      <Container fluid className="mt-4">
        {/* Botón para agregar empresa */}
        <Row className="mb-3">
          <Col className="text-right">
            <Button variant="success" onClick={agregarEmpresa}>Agregar empresa</Button>
          </Col>
        </Row>

        <Row>
          {/* Columna Izquierda - Empresas */}
          <Col md={6}>
            {empresas.map((empresa) => (
              <Card className="mb-4" key={empresa.id}>
                <Row>
                  <Col md={4}>
                    <Card.Img
                      variant="top"
                      src={empresa.imagenEmpresa}
                      alt={`${empresa.nombre} imagen`} />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{empresa.nombre}</Card.Title>
                      <Card.Text>CUIT: {empresa.cuit}</Card.Text>
                      <Card.Text>Razón social: {empresa.razonSocial}</Card.Text>
                      <Card.Text>{empresa.gmail}</Card.Text>
                      <Card.Text>{empresa.telefono}</Card.Text>
                      <Button variant="primary" onClick={() => buscarSucursales(empresa.id!)}>
                        Ver Sucursales
                      </Button>{' '}
                      <Button variant="primary" onClick={() => editarEmpresa(empresa.id!)}>Editar</Button>{' '}
                      <Button variant="danger" onClick={() => abrirModalEliminar(empresa)}>Eliminar</Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>

          {/* Columna Derecha - Sucursales */}
          <Col md={6}>
            {sucursales.length > 0 ? (
              sucursales.map((sucursal) => (
                <Card className="mb-3" key={sucursal.id}>
                  <Row className="g-0">
                    <Col md={4}>
                      <Card.Img src="Logo.png" alt="Imagen Sucursal" />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{sucursal.nombre}</Card.Title>
                        <Card.Text>Horario: {sucursal.horarioApertura} - {sucursal.horarioCierre}</Card.Text>
                        <Card.Text>Número de sucursal: {sucursal.numeroSucursal}</Card.Text>
                        <Button variant="primary" onClick={() => editarSucursal(sucursal.id!)}>Detalles sucursal</Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No posee sucursales</p>
            )}
          </Col>
        </Row>
      </Container>

      <ModalConfirmacion
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        onConfirm={confirmarEliminar}
        contentLabel="Confirmar eliminación" />
    </>
  );
};

export default EmpresaSucursal;
