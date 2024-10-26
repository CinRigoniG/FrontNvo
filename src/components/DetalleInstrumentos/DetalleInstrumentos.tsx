import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import { Button } from "react-bootstrap";
import "./DetalleInstrumentos.css";

const DetalleInstrumentos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalleInstrumento, setDetalleInstrumento] =
    useState<Instrumento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const instrumentoService = new InstrumentoService();
  const url = import.meta.env.VITE_API_URL;

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleInstrumentos;
