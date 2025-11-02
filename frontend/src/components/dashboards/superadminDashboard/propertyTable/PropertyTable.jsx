import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { toastSuccess, toastError } from "../../../ui/toaster/Notifications";
import ConfirmModal from "../../../ui/modal/ConfirmModal.jsx";
import {
  getAllProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
} from "../../../../services/propertyServices.js";

const PropertyTable = ({ token }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: "", item: null });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getAllProperties();
        setProperties(res);
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
      if (type === "delete") await deleteProperty(item.id, token);
      if (type === "approve") await approveProperty(item.id, token);
      if (type === "reject") await rejectProperty(item.id, token);

      setProperties((prev) =>
        prev
          .map((p) =>
            p.idProperty === item.idProperty
              ? {
                  ...p,
                  status:
                    type === "approve"
                      ? "approved"
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
      toastError(`Error al ${type}`);
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
        <thead>
          <tr>
            <th>Título</th>
            <th>Ubicación</th>
            <th>Propietario</th>
            <th>Disponible</th>
            <th>Destacada</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.location}</td>
              <td>{p.owner?.email || "N/A"}</td>
              <td>{p.available ? "Sí" : "No"}</td>
              <td>
                <Button
                  size="sm"
                  variant={p.featured ? "success" : "secondary"}
                  onClick={() => openModal("toggleFeatured", p)}
                >
                  <FontAwesomeIcon icon={faStar} className="me-2" />
                  {p.featured ? "Quitar" : "Destacar"}
                </Button>
              </td>
              <td>
                {p.status === "approved"
                  ? "Aprobada"
                  : p.status === "rejected"
                  ? "Rechazada"
                  : "Pendiente"}
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
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => openModal("reject", p)}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
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
      return `Eliminar "${item.title}"`;
    case "approve":
      return `Aprobar "${item.title}"`;
    case "reject":
      return `Rechazar "${item.title}"`;
    case "toggleFeatured":
      return item.featured
        ? `Quitar destacada de "${item.title}"`
        : `Destacar "${item.title}"`;
    default:
      return "";
  }
};

const getMessage = (type, item) => {
  if (!item) return "";
  switch (type) {
    case "delete":
      return `⚠️ Esta acción eliminará la propiedad "${item.title}".`;
    case "approve":
      return `¿Deseas aprobar la propiedad "${item.title}"?`;
    case "reject":
      return `⚠️ ¿Deseas rechazar la propiedad "${item.title}"?`;
    case "toggleFeatured":
      return item.featured
        ? `Quitar la propiedad de destacadas?`
        : `Destacar la propiedad?`;
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
    case "toggleFeatured":
      return "Confirmar";
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
    case "toggleFeatured":
      return "primary";
    default:
      return "primary";
  }
};

export default PropertyTable;
