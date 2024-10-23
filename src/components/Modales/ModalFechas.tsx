import { Modal, Button } from "react-bootstrap";
import './Modales.css';

interface ModalFechasProps {
    show: boolean;
    onHide: () => void;
    fechaDesde: string;
    fechaHasta: string;
    setFechaDesde: (value: string) => void;
    setFechaHasta: (value: string) => void;
    generarExcel: () => void;
}

const ModalFechas: React.FC<ModalFechasProps> = ({
    show,
    onHide,
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta,
    generarExcel,
}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            dialogClassName="Modal"
            backdropClassName="Overlay"
        >
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>Seleccionar Fechas</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <div className="input-group">
                    <label htmlFor="fechaDesde">Fecha Desde</label>
                    <input
                        type="date"
                        id="fechaDesde"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="fechaHasta">Fecha Hasta</label>
                    <input
                        type="date"
                        id="fechaHasta"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <Button className="modal-btn-secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button className="modal-btn-danger" onClick={generarExcel}>
                    Generar Excel
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalFechas;
