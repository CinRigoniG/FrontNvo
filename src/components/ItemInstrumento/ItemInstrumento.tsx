import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Modal, Col } from "react-bootstrap";
import imagenCamion from "./../../../public/images/camion-removebg-preview.png";
import Instrumento from "../../entities/Instrumento";
import { useCarrito } from "../../hooks/useCarrito";
import "./ItemInstrumento.css";

type InstrumentoParams = {
  id: number;
  instrumento: string;
  marca: string;
  modelo: string;
  imagen: string;
  precio: number;
  costoEnvio: string;
  cantidadVendida: number;
  descripcion: string;
  instrumentoObject: Instrumento;
  initialHayStock: boolean;
};

function ItemInstrumento(args: InstrumentoParams) {
  const { addCarrito } = useCarrito();
  const [showModal, setShowModal] = useState(false); // Estado para el modal

  const costoEnvioText =
    args.costoEnvio === "G" ? (
      <div className="envio-gratis">
        <img src={imagenCamion} alt="Envío gratis" className="imagen-camion" />
        <span className="text-success">Envío gratis a todo el país</span>
      </div>
    ) : (
      <span className="text-warning">
        Costo de Envío Interior de Argentina ${args.costoEnvio}
      </span>
    );

  const handleAddCarrito = () => {
    addCarrito(args.instrumentoObject);
    setShowModal(true); // Mostrar modal

    // Ocultar modal después de 3 segundos
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} className="col-card">
        <Card className="card-instrumento">
          <Card.Img
            variant="top"
            src={`./images/${args.imagen}`}
            alt={args.instrumento}
            className="img-altura-item-intrumento"
          />
          <Card.Body className="card-body">
            <Card.Title>{args.instrumento}</Card.Title>
            <Card.Text className="card-precio">$ {args.precio}</Card.Text>
            <Card.Text>{costoEnvioText}</Card.Text>
            <Link to={`/products/detalle/${args.id}`} className="link-detalles">
              Detalles <i className="bi bi-eye"></i>
            </Link>
            <Button className="btn-agregar" onClick={handleAddCarrito}>
              Agregar <i className="bi bi-cart-plus"></i>
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center">
          <h6>¡Se agregó al carrito!</h6>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ItemInstrumento;
