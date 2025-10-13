import React, { useState, useEffect, useContext } from "react";
import { Container, Tabs, Tab, Table, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faShield } from "@fortawesome/free-solid-svg-icons";

import ConfirmModal from "../../ui/modal/ConfirmModal.jsx";

import Notifications, {
  toastSuccess,
  toastError,
} from "../../ui/toaster/Notifications.jsx";

import usePagination from "../../../hooks/usePagination";
import { blockUser, delUser, getAllUsers } from "../../../services/userService";
import { AuthenticationContext } from "../../../services/auth.context";

export default function SuperadminDashboard() {
  const { token } = useContext(AuthenticationContext);
  const [showBlock, setShowBlock] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const [key, setKey] = useState("users");
  const [users, setUsers] = useState([]);
  const [pendientes, setPendientes] = useState([
    {
      id: 1,
      fecha: "01/09/2025",
      documento: "Contrato.pdf",
      propietario: "Pedro López",
    },
    {
      id: 2,
      fecha: "05/09/2025",
      documento: "Escritura.pdf",
      propietario: "Ana Torres",
    },
  ]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  const {
    data: propiedades,
    loading,
    loadMore,
    hasMore,
  } = usePagination("/properties");

  /* USERS */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers("users/all-users", token);
        setUsers(res);
      } catch (err) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      await blockUser(userId, token);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isBlocked: !currentStatus } : u
        )
      );

      toastSuccess("Cuenta bloqueada");
    } catch (error) {
      toastError("Algo pasó...");
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await delUser(userId, token);
      toastSuccess("Cuenta eliminada");

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (error) {
      toastError("Algo pasó...");
      throw error;
    }
  }

  /* PROPERTY */
  const toggleFeatured = async (id, currentValue) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/properties/${id}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ featured: !currentValue }),
        }
      );
      const update = await res.json();
      propiedades.forEach((p, idx) => {
        if (p.id === id) propiedades[idx].featured = update.property.featured;
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <Notifications />

      <h3>Bienvenido/a Super Admin,</h3>
      <Tabs
        id="superadmin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        mountOnEnter={false}
        unmountOnExit={false}
        className="mt-3 mb-3"
      >
        <Tab eventKey="users" title="Usuarios">
          {loadingUsers ? (
            <p>Cargando usuarios...</p>
          ) : errorUsers ? (
            <p className="text-danger">{errorUsers}</p>
          ) : (
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
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.surname}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`d-inline-block rounded-circle ${
                          u.isBlocked ? "bg-danger" : "bg-success"
                        }`}
                        style={{ width: "12px", height: "12px" }}
                        title={u.isBlocked ? "Bloqueado" : "Activo"}
                      ></span>
                    </td>
                    <td>
                      {u.role === "owner" && "Propietario"}
                      {u.role === "superadmin" && "SuperAdmin"}
                      {u.role === "user" && "Inquilino"}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        className="me-2"
                        title="Editar Usuario"
                      >
                        <FontAwesomeIcon icon={faPencil} className="me-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="btn btn-primary me-2"
                        title={u.isBlocked ? "Desbloquear" : "Bloquear"}
                        onClick={() => {
                          setSelectedUser(u);
                          setShowBlock(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faShield} className="me-2" />
                        {u.isBlocked ? "Desbloquear" : "Bloquear"}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        title="Eliminar usuario"
                        onClick={() => {
                          setSelectedUser(u);
                          setShowDelete(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="propiedades" title="Propiedades">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Ubicación</th>
                <th>Correo de Propietario</th>
                <th>Disponible</th>
                <th>Destacada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propiedades.map((p) => (
                <tr key={p.id}>
                  <td>{p.location}</td>
                  <td>{p.owner?.correo || "N/A"}</td>
                  <td>{p.avaiable ? "Si" : "No"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant={p.featured ? "success" : "secondary"}
                      onClick={() => toggleFeatured(p.id, p.featured)}
                    >
                      {p.featured ? "Quitar" : "Destacar"}
                    </Button>
                  </td>
                  <td>
                    <Button size="sm" variant="info" className="me-2">
                      Ver
                    </Button>
                    <Button size="sm" variant="danger">
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {hasMore && (
            <div className="text-center my-3">
              <Button variant="secondary" onClick={loadMore} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Cargando...
                  </>
                ) : (
                  "Cargar más"
                )}
              </Button>
            </div>
          )}
        </Tab>

        <Tab eventKey="pendientes" title="Pendientes">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha Publicación</th>
                <th>Documento Publicado</th>
                <th>Datos Propietario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((p) => (
                <tr key={p.id}>
                  <td>{p.fecha}</td>
                  <td>{p.documento}</td>
                  <td>{p.propietario}</td>
                  <td>
                    <Button size="sm" variant="success" className="me-2">
                      Aprobar
                    </Button>
                    <Button size="sm" variant="danger">
                      Rechazar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* MODAL */}
      <ConfirmModal
        show={showBlock}
        title={
          selectedUser.isBlocked
            ? "Confirmar desbloqueo de cuenta"
            : "Confirmar bloqueo de cuenta"
        }
        message={
          selectedUser.isBlocked
            ? `¿Deseas desbloquear la cuenta del usuario ${selectedUser.name} ${selectedUser.surname}?`
            : `⚠️ Esta acción bloqueará la cuenta del usuario del usuario ${selectedUser.name} ${selectedUser.surname}. ¿Deseas continuar?`
        }
        onConfirm={() => {
          handleToggleBlock(selectedUser.id, selectedUser.isBlocked);
          setShowBlock(false);
        }}
        onClose={() => setShowBlock(false)}
        confirmText={selectedUser.isBlocked ? "Desbloquear" : "Bloquear"}
        cancelText="Cancelar"
        variant={selectedUser.isBlocked ? "success" : "danger"}
      />

      <ConfirmModal
        show={showDelete}
        title="Confirmar eliminación de cuenta"
        message={`⚠️ Esta acción eliminará la cuenta del usuario del usuario ${selectedUser.name} ${selectedUser.surname}. ¿Deseas continuar?`}
        onConfirm={() => {
          handleDeleteUser(selectedUser.id);
          setShowDelete(false);
        }}
        onClose={() => setShowDelete(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </Container>
  );
}
