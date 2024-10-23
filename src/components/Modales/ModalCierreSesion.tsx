import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./Modales.css";

interface ModalCierreSesionProps {
    showModal: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalCierreSesion: React.FC<ModalCierreSesionProps> = ({ showModal, onConfirm, onCancel }) => {
    return (
        <Modal
            show={showModal}
            onHide={onCancel}
            dialogClassName="Modal"
            backdropClassName="Overlay"
        >
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>Confirmar Cierre de Sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">¿Estás seguro que quieres cerrar sesión?</Modal.Body>
            <Modal.Footer className="modal-footer">
                <Button className="modal-btn-secondary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button className="modal-btn-danger" onClick={onConfirm}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ModalCierreSesion;
