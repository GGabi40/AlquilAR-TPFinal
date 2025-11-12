import React, { useEffect, useState } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faXmark,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../../ui/modal/ConfirmModal";
import DocsModal from "../../../ui/modal/DocsModal";
import { toastSuccess, toastError } from "../../../ui/toaster/Notifications";
import {
  getAllProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
} from "../../../../services/propertyServices.js";
import { getUserById } from "../../../../services/userService.js";

const RequestApprovalTable = ({ token }) => {
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: "", item: null });
  const [docsModal, setDocsModal] = useState({ show: false, property: null });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getAllProperties(token);
        // Filtramos solo las pendientes
        const pendingProps = Array.isArray(res)
          ? res.filter((p) => p.status === "pending")
          : [];
        setProperties(pendingProps);

        // Traer emails de propietarios
        pendingProps.forEach(async (prop) => {
          if (prop.ownerId) {
            try {
              const user = await getUserById(prop.ownerId, "users", token);
              setOwners((prev) => ({
                ...prev,
                [prop.ownerId]: user.email,
              }));
            } catch (error) {
              console.error("Error al obtener propietario:", error);
            }
          }
        });
      } catch (err) {
        toastError("No se pudieron cargar las solicitudes");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [token]);

  const openModal = (type, item) => setModal({ show: true, type, item });
  const closeModal = () => setModal({ show: false, type: "", item: null });

  const handleConfirm = async () => {
    const { type, item } = modal;
    try {
      if (type === "approve") await approveProperty(item.idProperty, token);
      if (type === "reject") await rejectProperty(item.idProperty, token);
      if (type === "delete") await deleteProperty(item.idProperty, token);

      setProperties((prev) =>
        prev.filter((p) => p.idProperty !== item.idProperty)
      );

      toastSuccess(
        type === "approve"
          ? "Propiedad aprobada correctamente"
          : type === "reject"
          ? "Propiedad rechazada correctamente"
          : "Propiedad eliminada correctamente"
      );
    } catch {
      toastError(`Error al ${type} la propiedad`);
    } finally {
      closeModal();
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;

  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <div className="text-center mt-4">
        <p className="text-black">
          📂 No hay propiedades pendientes de revisión.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>#ID</th>
            <th>Tipo</th>
            <th>Dirección</th>
            <th>Propietario</th>
            <th>Documentos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.idProperty}>
              <td>{p.idProperty}</td>
              <td className="text-capitalize">{p.propertyType}</td>
              <td>{p.address}</td>
              <td>{owners[p.ownerId] || "Cargando..."}</td>
              <td>
                {p.PropertyDocuments?.length > 0 ? (
                  <Badge bg="info">{p.PropertyDocuments.length} doc(s)</Badge>
                ) : (
                  <Badge bg="secondary">Sin docs</Badge>
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  className="me-2"
                  onClick={() => setDocsModal({ show: true, property: p })}
                >
                  <FontAwesomeIcon icon={faEye} /> Ver
                </Button>

                <Button
                  size="sm"
                  variant="success"
                  className="me-2"
                  onClick={() => openModal("approve", p)}
                >
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Aprobar
                </Button>

                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => openModal("reject", p)}
                >
                  <FontAwesomeIcon icon={faXmark} className="me-2" />
                  Rechazar
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => openModal("delete", p)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {docsModal.show && (
        <DocsModal
          show={docsModal.show}
          onClose={() => setDocsModal({ show: false, property: null })}
          property={docsModal.property}
          token={token}
          onStatusChange={(id, newStatus) => {
            setProperties((prev) =>
              prev.map((p) =>
                p.idProperty === id ? { ...p, status: newStatus } : p
              )
            );
          }}
        />
      )}

      {modal.show && (
        <ConfirmModal
          show={modal.show}
          title={getTitle(modal.type, modal.item)}
          message={getMessage(modal.type, modal.item)}
          onConfirm={handleConfirm}
          onClose={closeModal}
          confirmText={getConfirmText(modal.type)}
          variant={getVariant(modal.type)}
        />
      )}
    </>
  );
};

const getTitle = (type, item) => {
  if (!item) return "";
  switch (type) {
    case "delete":
      return `Eliminar propiedad #${item.idProperty}`;
    case "approve":
      return `Aprobar propiedad #${item.idProperty}`;
    case "reject":
      return `Rechazar propiedad #${item.idProperty}`;
    default:
      return "";
  }
};

const getMessage = (type, item) => {
  if (!item) return "";
  switch (type) {
    case "delete":
      return `⚠️ Esta acción eliminará la propiedad ubicada en "${item.address}".`;
    case "approve":
      return `¿Deseas aprobar la propiedad ubicada en "${item.address}"?`;
    case "reject":
      return `⚠️ ¿Deseas rechazar la propiedad ubicada en "${item.address}"?`;
    default:
      return "";
  }
};

const getConfirmText = (type) => {
  switch (type) {
    case "delete":
      return "Eliminar";
    case "approve":
      return "Aprobar";
    case "reject":
      return "Rechazar";
    default:
      return "Confirmar";
  }
};

const getVariant = (type) => {
  switch (type) {
    case "delete":
      return "danger";
    case "approve":
      return "success";
    case "reject":
      return "warning";
    default:
      return "primary";
  }
};

export default RequestApprovalTable;
