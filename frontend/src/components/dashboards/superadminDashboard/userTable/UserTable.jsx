import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faShield } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../../ui/modal/ConfirmModal.jsx";
import { toastSuccess, toastError } from "../../../ui/toaster/Notifications.jsx";
import { getAllUsers, blockUser, delUser, updateRole } from "../../../../services/userService.js";

const UserTable = ({ token, userId }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedRole, setEditedRole] = useState(null);
    const [modal, setModal] = useState({ show: false, type: "", item: null });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers("users/all-users", token);
                setUsers(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    const openModal = (token, item) => setModal({ show: true, type, item });
    const closeModal = () => setModal({ show: false, type: "", item: null });

    const handleConfirm = async () => {
        const { type, item } = modal;
        try {
            if (type === "delete") await delUser(item.id, token);
            if (type === "block") await blockUser(item.id, token);
            if (type === "saveRole") await updateRole(item.id, token, { role: editedRole });

            setUsers(prev => prev.map(u => u.id === item.id ? { ...u, isBlocked: type === "block" ? !u.isBlocked : u.role === editedRole ? editedRole : u.role } : u)
                .filter(u => type === "delete" ? u.id !== item.id : true)
            );
            toastSuccess(`${type} realizado correctamente`);
        } catch {
            toastError(`Error al ${type}`);
        } finally {
            closeModal();
            if (type === "saveRol") { setEditingUserId(null); setEditedRole(null); }
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo Electrónico</th>
                        <th>Estado</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.surname}</td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`d-inline-block rounded-circle ${u.isBlocked ? "bg-danger" : "bg-success"}`} style={{ width: 12, height: 12 }}></span>
                            </td>
                            <td>
                                {editingUserId === u.id ? (
                                    <select value={editedRole} onChange={e => setEditedRole(e.target.value)} className="form-select">
                                        <option value="superadmin">Superadmin</option>
                                        <option value="owner">Propietario</option>
                                        <option value="user">Inquilino</option>
                                    </select>
                                ) : ({ superadmin: "SuperAdmin", owner: "Propietario", user: "Inquilino" }[u.role])}
                            </td>
                            <td>
                                {editingUserId === u.id ? (
                                    <Button size="sm" variant="success" className="me-2" onClick={() => openModal("saveRole", u)}>Guardar</Button>
                                ) : (
                                    <Button size="sm" variant="info" className="me-2" disabled={userId === u.id} onClick={() => { setEditingUserId(u.id); setEditedRole(u.role); }}>
                                        <FontAwesomeIcon icon={faPencil} className="me-2" />Editar
                                    </Button>
                                )}
                                <Button size="sm" variant="primary" className="me-2" disabled={userId === u.id} onClick={() => openModal("block", u)}>
                                    <FontAwesomeIcon icon={faShield} className="me-2" />{u.isBlocked ? "Desbloquear" : "Bloquear"}
                                </Button>
                                <Button size="sm" variant="danger" disabled={userId === u.id} onClick={() => openModal("delete", u)}>
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

export default UserTable;