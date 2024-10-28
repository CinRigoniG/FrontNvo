import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import { Button, Modal } from "react-bootstrap";
import "./DetalleInstrumentos.css";
import { useCarrito } from "../../hooks/useCarrito";

const DetalleInstrumentos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalleInstrumento, setDetalleInstrumento] =
    useState<Instrumento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const instrumentoService = new InstrumentoService();
  const url = import.meta.env.VITE_API_URL;
  const { addCarrito } = useCarrito();
  const [showModal, setShowModal] = useState(false); // Estado para el modal

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const idNumber = parseInt(id);
        const detalleInstrumentoData = await instrumentoService.get(
          url + "instrumento",
          idNumber
        );
        setDetalleInstrumento(detalleInstrumentoData);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const generarPDF = () => {
    window.open(
      "https://depositoback-production.up.railway.app/api/pedido/downloadPdf/" +
      id,
      "_blank"
    );
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleVolver = () => {
    navigate("/products");
  };

  const handleAddCarrito = () => {
    if (detalleInstrumento) { // Asegurarse de que detalleInstrumento no es null
      addCarrito(detalleInstrumento);
      setShowModal(true);
  
      // Ocultar modal después de 3 segundos
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }
  };
  
  return (
    <div className="main-container">
      <div className="container-detalle">
        <div className="col-md-6">
          <img
            src={`/images/${detalleInstrumento?.imagen}`}
            className="custom-image"
            alt={detalleInstrumento?.instrumento || "Instrumento"}
          />
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h2 className="card-title">{detalleInstrumento?.instrumento}</h2>
            <p className="card-vendida">
              {detalleInstrumento?.cantidadVendida} vendidos
            </p>
            <p className="card-text">
              <b> Marca: </b>{detalleInstrumento?.marca} <br />
              <b>Modelo:</b> {detalleInstrumento?.modelo}
            </p>
            <p className="card-text">
              <b> Categoría: </b>{" "}
              {detalleInstrumento?.categoria?.denominacion || "Sin categoría"}
            </p>
            <p className="card-text">
              {detalleInstrumento?.costoEnvio === "G" ? (
                <>
                  <img
                    src="/images/camion-removebg-preview.png"
                    alt="Envío Gratis"
                    style={{ width: "50px" }}
                  />
                  Envío gratis a todo el país
                </>
              ) : (
                `Costo de Envío: $${detalleInstrumento?.costoEnvio}`
              )}
            </p>
            <p className="card-text">
              <b>Descripción:</b> <br />
              {detalleInstrumento?.descripcion}
            </p>
            <Button onClick={handleVolver}>Volver</Button>
            <Button className="btn-success" onClick={generarPDF}>
              Generar PDF
            </Button>
            <Button className="btn-agregar" onClick={handleAddCarrito}>
              Agregar <i className="bi bi-cart-plus"></i>
            </Button>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center">
          <h6>¡Se agregó al carrito!</h6>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetalleInstrumentos;
