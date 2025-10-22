import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../../ui/modal/ConfirmModal";
import { toastSuccess, toastError } from "../../../ui/toaster/Notifications";
import { getAllProperties, approveProperty, rejectProperty, deleteProperty } from "../../../../services/propertyServices.js";

const RequestApprovalTable = ({ token }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, type: "", item: null });

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await getAllProperties(token); setProperties(res.filter((p) => p.status === "pending"));
            } catch (err) {
                toastError("No se pudieron cargar las propiedades");
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
            if (type === "approve") await approveProperty(item.id, token);
            if (type === "reject") await rejectProperty(item.id, token);
            if (type === "delete") await deleteProperty(item.id, token);

            setProperties(prev => prev.filter(p => p.id !== item.id));
            toastSuccess(`${type} realizado correctamente`);
        } catch {
            toastError(`Error al ${type}`);
        } finally {
            closeModal();
        }
    };

    if (loading) return <p>Cargando solicitudes...</p>;

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Ubicación</th>
                        <th>Propietario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map(p => (
                        <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>{p.location}</td>
                            <td>{p.owner?.email || "N/A"}</td>
                            <td>
                                <Button size="sm" variant="success" className="me-2" onClick={() => openModal("approve", p)}>Aprobar</Button>
                                <Button size="sm" variant="warning" className="me-2" onClick={() => openModal("reject", p)}>Rechazar</Button>
                                <Button size="sm" variant="danger" onClick={() => openModal("delete", p)}>
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
    case "delete": return `Eliminar "${item.title}"`;
    case "approve": return `Aprobar "${item.title}"`;
    case "reject": return `Rechazar "${item.title}"`;
    default: return "";
  }
};

const getMessage = (type, item) => {
  if (!item) return "";
  switch (type) {
    case "delete": return `⚠️ Esta acción eliminará la propiedad "${item.title}".`;
    case "approve": return `¿Deseas aprobar la propiedad "${item.title}"?`;
    case "reject": return `⚠️ ¿Deseas rechazar la propiedad "${item.title}"?`;
    default: return "";
  }
};

const getConfirmText = type => {
  switch (type) {
    case "delete": return "Eliminar";
    case "approve": return "Aprobar";
    case "reject": return "Rechazar";
    default: return "Confirmar";
  }
};

const getVariant = type => {
  switch (type) {
    case "delete": return "danger";
    case "approve": return "success";
    case "reject": return "warning";
    default: return "primary";
  }
};

export default RequestApprovalTable;