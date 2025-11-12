import React, { useState } from "react";
import { Modal, Button, Spinner, Badge, Card } from "react-bootstrap";
import { toastSuccess, toastError } from "../toaster/Notifications";
import {
  approveProperty,
  rejectProperty,
} from "../../../services/propertyServices";

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

  const docs = property?.PropertyDocuments || [];

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Documentos de Propiedad #{property.idProperty}{" "}
          <Badge
            bg={
              property.status === "available"
                ? "success"
                : property.status === "rejected"
                ? "danger"
                : "warning"
            }
          >
            {property.status === "available"
              ? "Aprobada"
              : property.status === "rejected"
              ? "Rechazada"
              : "Pendiente"}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h6 className="fw-bold mb-3">📄 Documentos cargados:</h6>

        {docs.length > 0 ? (
          <div className="d-flex flex-wrap gap-3">
            {docs.map((doc) => (
              <Card
                key={doc.documentId}
                style={{
                  width: "18rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                {/* Mostrar miniatura si es imagen */}
                {doc.URLDocument.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <Card.Img
                    variant="top"
                    src={doc.URLDocument}
                    alt={`Documento ${doc.documentId}`}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "200px", borderRadius: "8px 8px 0 0" }}
                  >
                    <p className="text-muted mb-0">📑 Documento</p>
                  </div>
                )}

                <Card.Body className="text-center">
                  <Card.Text className="text-truncate small mb-2">
                    {doc.URLDocument.split("/").pop()}
                  </Card.Text>
                  <Button
                    variant="primary"
                    size="sm"
                    href={doc.URLDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver archivo
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
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
