import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import SucursalService from '../../services/SucursalService';
import { Sucursal } from '../../entities/Sucursal';
import './Sucursales.css'; 

const Sucursales = () => {
  const { idEmpresa } = useParams<{ idEmpresa: string }>();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const sucursalService = new SucursalService();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSucursales = async () => {
      const sucursalesData = await sucursalService.getByEmpresaId(url + 'sucursal', Number(idEmpresa));
      setSucursales(sucursalesData);
    };
    fetchSucursales();
  }, [idEmpresa]);

  const editarSucursal = (idSucursal: number) => {
    navigate(`/formularioSucursal/${idSucursal}`);
  };

  const volverAtras = () => {
    navigate(-1); // Navega a la pantalla anterior
  };

/*   const detalleSucursal = (idSucursal: number) => {
    navigate(`/detalleSucursal/${idSucursal}`);
  }; */


  return (
    <Container>
      <h2 className="mt-4">Administración de sucursales</h2>
      <Row>
        {sucursales.length > 0 ? (
          sucursales.map((sucursal) => (
            <Col md={4} key={sucursal.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{sucursal.nombre}</Card.Title>
                  <Card.Text>Horario: {sucursal.horarioApertura} - {sucursal.horarioCierre}</Card.Text>
                  <Card.Text>Número de sucursal: {sucursal.numeroSucursal}</Card.Text>
                  <Button className="btn-modificar" onClick={() => editarSucursal(sucursal.id!)}>
                    Modificar Sucursal
                  </Button>
                 {/*  <Button className="btn-modificar" onClick={() => detalleSucursal(sucursal.id!)}>
                    ver
                  </Button> */}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No posee sucursales</p>
        )}
      </Row>

      {/* Botón de Volver */}
      <Row className="mt-4">
        <Col className="text-center">
          <Button className="btn-volver" onClick={volverAtras}>Volver</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Sucursales;
