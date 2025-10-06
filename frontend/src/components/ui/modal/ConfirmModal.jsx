import React from "react";
import { Modal, Button } from "react-bootstrap";

/**
Modal reutilizable para confirmaciones o mensajes

Props:
- show: boolean -> controla la visibilidad
- title: string -> título del modal
- message: string | JSX -> texto o contenido del modal
- onConfirm: función -> acción a ejecutar al confirmar
- onClose: función -> cierra el modal
- confirmText: string -> texto del botón confirmar (por defecto "Confirmar")
- cancelText: string -> texto del botón cancelar (por defecto "Cancelar")
- variant: string -> variante del botón principal (por defecto "primary")
 */
const ConfirmModal = ({
  show,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-semibold">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {typeof message === "string" ? (
          <p className="mb-0">{message}</p>
        ) : (
          message
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
