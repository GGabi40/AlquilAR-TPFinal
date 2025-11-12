import { Navbar, Container, Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import usePagination from "../../../hooks/usePagination.js";
import { PostService } from "../../../services/PostService.js";
import Notifications, { toastError, toastSuccess} from "../../ui/toaster/Notifications.jsx";
import ConfirmModal from "../../ui/modal/ConfirmModal.jsx";
import { useContext, useState, useEffect } from "react";
import { AuthenticationContext } from "../../../services/auth.context.jsx"

export default function OwnerDashboard() {
  const {token, userId, role} = useContext(AuthenticationContext)
  const navigate = useNavigate();

  const { 
    data: posts,
    loading,
    loadMore,
    hasMore,
    setData,
  } = usePagination(`/posts/owner/${userId}`, token);

  const [modalShow, setModalShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
        try {
          const userData = await getUserById(userId, "users", token);
          setUser(userData);
        } catch (error) {
          console.error('algo pasó....', error);
        }
    };
    fetchUser();
  }, [userId, token]);

  const handlePauseResume = async (post) => {
    const newStatus = post.status === "active" ? "paused" : "active";
    try {
      await PostService.updateStatus(post.id, newStatus, token);
      setData((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
      );
      toastSuccess(
        `Publicación ${newStatus === "paused" ? "pausada" : "reactivada"} correctamente`
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toastError("No se pudo cambiar el estado de la publicación.");
    }
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      await PostService.deletePost(selectedId, token);
      setData((prev) => prev.filter((p) => p.id !== selectedId));
      toastSuccess("Publicación eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      toastError("No se pudo eliminar la publicación.");
    } finally {
      setModalShow(false);
      setSelectedId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/posts/edit/${id}`);
  };

  return (
    <div>
      <Notifications />
      <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
        <Container fluid>
          <Navbar.Brand>AlquilAR</Navbar.Brand>
          <div className="d-flex align-items-center text-white">
            <span className="me-2">{user.name} ({role})</span>
          </div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h3>Bienvenido/a {user.name},</h3>
        <p className="text-muted">Estas son tus publicaciones:</p>

        {loading && posts.length === 0 ? (
          <p>Cargando propiedades...</p>
        ) : posts.length === 0 ? (
          <p>No tienes propiedades registradas todavía.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Título</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.price}</td>
                  <td>
                    {p.status === "active"
                      ? "🟢 Activa"
                      : p.status === "paused"
                        ? "⏸️ Pausada"
                        : "🏠 Alquilada"}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant={p.status === "active" ? "warning" : "success"}
                      className="me-2"
                      onClick={() => handlePauseResume(p)}
                    >
                      {p.status === "active" ? "Pausar" : "Reanudar"}
                    </Button>

                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => handleEdit(p.id)}
                    >
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {hasMore && (
          <div className="text-center my-3">
            <Button variant="secondary" onClick={loadMore} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Cargando...
                </>
              ) : (
                "Cargar más"
              )}
            </Button>
          </div>
        )}

        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate("/propiedad/create")}>
            + Agregar nueva propiedad
          </Button>
        </div>
      </Container>

      <ConfirmModal
        show={modalShow}
        title="Eliminar publicación"
        message="¿Seguro que querés eliminar esta publicación? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onClose={() => setModalShow(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        />
    </div>
  );
}