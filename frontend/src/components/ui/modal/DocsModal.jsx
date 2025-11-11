import React, { useState } from "react";
import { Modal, Button, Spinner, Badge } from "react-bootstrap";
import { toastSuccess, toastError } from "../toaster/Notifications";
import { approveProperty, rejectProperty } from "../../../services/propertyServices";

const DocsModal = ({ show, onClose, property, token, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  if (!property) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveProperty(property.idProperty, token);
      toastSuccess(`Propiedad #${property.idProperty} aprobada correctamente`);
      onStatusChange(property.idProperty, "available");
      onClose();
    } catch (error) {
      toastError("Error al aprobar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await rejectProperty(property.idProperty, token);
      toastSuccess(`Propiedad #${property.idProperty} rechazada correctamente`);
      onStatusChange(property.idProperty, "rejected");
      onClose();
    } catch (error) {
      toastError("Error al rechazar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Documentos de Propiedad #{property.idProperty}{" "}
          <Badge bg={
            property.status === "available"
              ? "success"
              : property.status === "rejected"
              ? "danger"
              : "warning"
          }>
            {property.status === "available"
              ? "Aprobada"
              : property.status === "rejected"
              ? "Rechazada"
              : "Pendiente"}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h6 className="fw-bold">📄 Documentos cargados:</h6>
        {property.documents?.length ? (
          property.documents.map((doc, index) => (
            <div key={index} className="mb-3">
              <p className="mb-1 fw-semibold">{doc.title || "Documento"}</p>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                Ver documento
              </a>
            </div>
          ))
        ) : (
          <p className="text-muted">Aún no se ha subido ningún documento.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        {property.status === "pending" && (
          <>
            <Button
              variant="success"
              onClick={handleApprove}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Aprobar"}
            </Button>
            <Button
              variant="warning"
              onClick={handleReject}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Rechazar"}
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocsModal;
