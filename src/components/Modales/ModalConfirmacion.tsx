import React from "react";
import './Modales.css';
import { Button, Modal } from "react-bootstrap";

interface ModalConfirmacionProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    contentLabel: string;
}

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({ isOpen, onRequestClose, onConfirm, contentLabel }) => {
    return (
        <Modal
            show={isOpen}
            onHide={onRequestClose}
            dialogClassName="Modal"
            backdropClassName="Overlay"
            contentLabel={contentLabel}
        >
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">¿Estás seguro de que deseas eliminar?</Modal.Body>
            <Modal.Footer className="modal-footer">
                <Button className="modal-btn-secondary" onClick={onRequestClose}>
                    Cancelar
                </Button>
                <Button className="modal-btn-danger" onClick={onConfirm}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalConfirmacion;
