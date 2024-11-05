import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SucursalService from "../../services/SucursalService";
import { Button } from "react-bootstrap";
import { Sucursal } from "../../entities/Sucursal";

const DetalleSucursal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalleSucursal, setDetalleSucursal] = useState<Sucursal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL; // Cambia esto si es necesario

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const idNumber = parseInt(id);
        const detalleSucursalData = await sucursalService.get(url + "sucursal", idNumber);
        setDetalleSucursal(detalleSucursalData);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleVolver = () => {
    navigate("/sucursales"); // Cambia la ruta según corresponda
  };

  return (
    <div className="main-container">
      <div className="container-detalle">
        <div className="col-md-6">
          <h2 className="card-title">{detalleSucursal?.nombre}</h2>
          <p><b>Horario de Apertura:</b> {detalleSucursal?.horarioApertura}</p>
          <p><b>Horario de Cierre:</b> {detalleSucursal?.horarioCierre}</p>
          <p><b>Número de Sucursal:</b> {detalleSucursal?.numeroSucursal}</p>
          <p><b>Domicilio:</b> {detalleSucursal?.domicilio.calle}</p>
          <p><b>Empresa:</b> {detalleSucursal?.empresa.nombre}</p>
        </div>
        <div className="col-md-6">
          {/* Aquí puedes agregar una imagen de la sucursal si la tienes */}
        </div>
        <div className="botones-container">
          <Button className="btn-volver" onClick={handleVolver}>Volver</Button>
        </div>
      </div>
    </div>
  );
};

export default DetalleSucursal;
