import React, { useEffect, useState } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faXmark,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { toastSuccess, toastError } from "../../../ui/toaster/Notifications";
import ConfirmModal from "../../../ui/modal/ConfirmModal.jsx";
import {
  getAllProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
} from "../../../../services/propertyServices.js";
import { getUserById } from "../../../../services/userService.js";
import DocsModal from "../../../ui/modal/DocsModal.jsx";

const PropertyTable = ({ token }) => {
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: "", item: null });
  const [docsModal, setDocsModal] = useState({ show: false, property: null });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getAllProperties();
        setProperties(Array.isArray(res) ? res : []);

        res.forEach(async (prop) => {
          if (prop.ownerId) {
            try {
              const user = await getUserById(prop.ownerId, "users", token);
              setOwners((prev) => ({
                ...prev,
                [prop.ownerId]: user.email,
              }));
            } catch (error) {
              console.error("Error al obtener el propietario:", error);
            }
          }
        });
      } catch (err) {
        toastError("No se pudieron cargar las propiedades");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const openModal = (type, item) => setModal({ show: true, type, item });
  const closeModal = () => setModal({ show: false, type: "", item: null });

  const handleConfirm = async () => {
    const { type, item } = modal;
    try {
      if (type === "delete") await deleteProperty(item.idProperty, token);
      if (type === "approve") await approveProperty(item.idProperty, token);
      if (type === "reject") await rejectProperty(item.idProperty, token);

      setProperties((prev) =>
        prev
          .map((p) =>
            p.idProperty === item.idProperty
              ? {
                  ...p,
                  status:
                    type === "approve"
                      ? "available"
                      : type === "reject"
                      ? "rejected"
                      : p.status,
                }
              : p
          )
          .filter((p) =>
            type === "delete" ? p.idProperty !== item.idProperty : true
          )
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

  if (loading) return <p>Cargando propiedades...</p>;

  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <div className="text-center mt-4">
        <p className="text-black">
          🏠 Aún no hay propiedades registradas en el sistema.
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
            <th>Precio / Expensas</th>
            <th>Propietario</th>
            <th>Preferencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.idProperty}>
              <td>{p.idProperty}</td>
              <td className="text-capitalize">{p.propertyType}</td>
              <td>{p.address}</td>
              <td>
                <span className="fw-bold text-success">${p.rentPrice}</span>
                {p.expensesPrice && (
                  <span className="text-muted ms-1">
                    + ${p.expensesPrice} exp.
                  </span>
                )}
              </td>
              <td>{owners[p.ownerId] || "Cargando..."}</td>
              <td className="text-capitalize">{p.rentPreference}</td>
              <td>
                {p.status === "available" ? (
                  <Badge bg="success">Aprobada</Badge>
                ) : p.status === "rejected" ? (
                  <Badge bg="danger">Rechazada</Badge>
                ) : (
                  <Badge bg="warning" text="dark">
                    Pendiente
                  </Badge>
                )}
              </td>
              <td>
                {p.status === "pending" && (
                  <>
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
                  </>
                )}
                <Button
                  size="sm"
                  variant="info"
                  className="me-2"
                  onClick={() => setDocsModal({ show: true, item: p })}
                >
                  <FontAwesomeIcon icon={faEye} />
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
      return `⚠️ Esta acción eliminará la propiedad en "${item.address}".`;
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

export default PropertyTable;
