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
      <span className="text-success d-flex align-items-center">
        <img src={imagenCamion} alt="Envío gratis" className="imagen-camion" />
        Envío gratis a todo el país
      </span>
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
    <Col>
      <Card>
        <Card.Img
          variant="top"
          src={`./images/${args.imagen}`}
          alt={args.instrumento}
        />
        <Card.Body>
          <Card.Title>{args.instrumento}</Card.Title>
          <Card.Text>$ {args.precio}</Card.Text>
          <Card.Text>{costoEnvioText}</Card.Text>

          <Link to={`/products/detalle/${args.id}`}>
            Detalles <i className="bi bi-eye"></i>
          </Link>
          <hr />
          <div>
            <Button variant="primary" onClick={handleAddCarrito}>
              Agregar <i className="bi bi-cart-plus"></i>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <h6>¡Se agregó al carrito!</h6>
        </Modal.Body>
      </Modal>
    </Col>
  );
}

export default ItemInstrumento;
