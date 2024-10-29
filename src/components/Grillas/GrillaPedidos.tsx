import { useEffect, useState } from "react";
import Pedido from "../../entities/Pedido";
import PedidoService from "../../services/PedidoService";
import { useUser } from "../../context/UserContext";
import { Button, Modal, Row, Table } from "react-bootstrap";
import { Roles } from "../../entities/Roles";
import { Link } from "react-router-dom";
import ModalConfirmacion from "../Modales/ModalConfirmacion";
import ModalFechas from "../Modales/ModalFechas";
import AfipService from "../../services/Afip/AfipService";
import "./Grillas.css";

const GrillaPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalFacturacion, setModalFacturacion] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState<Pedido | null>(null);
  const [pedidoFacturar, setPedidoFacturar] = useState<Pedido | null>(null);
  const [facturacionResponse, setFacturacionResponse] = useState<{
    cae: string;
    vencimiento: string;
  } | null>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const pedidoService = new PedidoService();
  const afipService = AfipService();
  const { usuarioL } = useUser(); // Obtener el usuario logueado del contexto

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const pedidosData = await pedidoService.getAll(url + "pedido");
      setPedidos(pedidosData);
    };
    fetchData();
  }, []);

  const abrirModal = () => setShowModal(true);
  const cerrarModal = () => setShowModal(false);

  const abrirModalEliminar = (pedido: Pedido) => {
    setPedidoAEliminar(pedido);
    setModalIsOpen(true);
  };

  const cerrarModalEliminar = () => {
    setModalIsOpen(false);
    setPedidoAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (pedidoAEliminar) {
      await pedidoService.delete(url + "pedido", pedidoAEliminar.id);
      setModalIsOpen(false);
      setPedidoAEliminar(null);
      window.location.reload();
    }
  };

  const generarExcel = () => {
    if (fechaDesde && fechaHasta) {
      const url = `https://depositoback-production-b0f4.up.railway.app/api/pedido/downloadExcel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
      window.open(url, "_blank");
      cerrarModal();
    } else {
      alert("Por favor ingresa ambas fechas.");
    }
  };

  const facturar = async () => {
    let total = 0;

    if (pedidoFacturar != null) {
      total = pedidoFacturar?.totalPedido;
    }

    let iva = total * 0.21;
    let importe = total - iva;

    const datosComprobante = {
      cuitCliente: 20409378472,
      ptoVenta: 1,
      comprobante: 6, // 1 Factura A - 6 Factura B
      concepto: 1, //1 Productos - 2 Servicios - 3 Prod y Serv
      tipoDoc: 99, // 80 CUIT - 86 CUIL - 96 DNI - 99 Cons Final
      nroDoc: 0, // 0 Consumidor Final
      importeGravado: importe,
      importeIva: iva,
      importeExentoIva: 0,
    };

    try {
      const response = await afipService.generarComprobante(datosComprobante);
      setFacturacionResponse(response); // Guardamos la respuesta de la facturación
      setModalFacturacion(true); // Abrimos el modal de facturación
    } catch (error) {
      console.error("Error al generar el comprobante", error);
    }
  };

  const cerrarModalFacturacion = () => {
    setModalFacturacion(false);
    setFacturacionResponse(null);
  };

  return (
    <>
      <Row className="row-centrado" style={{ marginLeft: "10px" }}>
        {usuarioL?.nombreRol === Roles.ADMIN && (
          <Button onClick={abrirModal} className="botones-grilla">
            Generar excel
          </Button>
        )}
      </Row>
      <Table className="tabla-grilla" striped bordered hover>
        <thead className="grilla">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Total pedido</th>
            {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
            {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
            {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
            {usuarioL?.nombreRol === Roles.ADMIN && <th></th>}
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido: Pedido, index) => (
            <tr key={index}>
              <td>{pedido.id}</td>
              <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
              <td>{pedido.usuario?.nombre || "Sin usuario"}</td>
              <td>{pedido.totalPedido}</td>
              <td>
                <Link to={`/detallePedido/${pedido.id}`}>
                  <i className="bi bi-eye icono-detalle"></i>
                </Link>
              </td>
              {usuarioL?.nombreRol === Roles.ADMIN && (
                <>
                  <td>
                    <Link to={`/formularioPedido/${pedido.id}`}>
                      <i className="bi bi-pencil icono-editar"></i>
                    </Link>
                  </td>
                  <td>
                    <i
                      className="bi bi-trash icono-borrar"
                      style={{ cursor: "pointer" }}
                      onClick={() => abrirModalEliminar(pedido)}
                    ></i>
                  </td>
                  <td>
                    <Button
                      className="BotonFacturar"
                      onClick={() => {
                        setPedidoFacturar(pedido);
                        facturar();
                      }}
                    >
                      Facturar
                    </Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalConfirmacion
        isOpen={modalIsOpen}
        onRequestClose={cerrarModalEliminar}
        onConfirm={confirmarEliminar}
        contentLabel="Confirmar Eliminación"
      />

      <ModalFechas
        show={showModal}
        onHide={cerrarModal}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        setFechaDesde={setFechaDesde}
        setFechaHasta={setFechaHasta}
        generarExcel={generarExcel}
      />

      {/* Modal de Facturación */}
      <Modal show={modalFacturacion} onHide={cerrarModalFacturacion}>
        <Modal.Header closeButton>
          <Modal.Title>Factura emitida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {facturacionResponse && (
            <>
              <p>CAE: {facturacionResponse.cae}</p>
              <p>Vencimiento: {facturacionResponse.vencimiento}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalFacturacion}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GrillaPedidos;
