import {
  Navbar,
  Container,
  Table,
  Button,
  Spinner
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { PostService } from "../../../services/PostService.js";
import Notifications, {
  toastError,
  toastSuccess,
} from "../../ui/toaster/Notifications.jsx";
import ConfirmModal from "../../ui/modal/ConfirmModal.jsx";
import { useContext, useState, useEffect } from "react";
import { AuthenticationContext } from "../../../services/auth.context.jsx";
import { getUserById } from "../../../services/userService.js";
import OwnerStats from "./OwnerStats.jsx";

export default function OwnerDashboard() {
  const { token, userId, role } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [user, setUser] = useState({});

  // Traer datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId, "users", token);
        setUser(userData);
      } catch (error) {
        console.error("algo pasó....", error);
      }
    };
    fetchUser();
  }, [userId, token]);

  // Traer POSTS del owner
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await PostService.getPostsByOwner(userId, token);
        setPosts(result);
      } catch (error) {
        console.error("Error al obtener posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, token]);

  const handlePauseResume = async (post) => {
    const newStatus = post.status === "active" ? "paused" : "active";
    try {
      await PostService.updateStatus(post.id, newStatus, token);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
      );
      toastSuccess(
        `Publicación ${
          newStatus === "paused" ? "pausada" : "reactivada"
        } correctamente`
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
      setPosts((prev) => prev.filter((p) => p.id !== selectedId));
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
    <div style={{ maxWidth: '900px', margin:'auto' }}>
      <Notifications />

      <Button variant="secondary" className="m-2 rounded-3" onClick={() => setShow(!show)}>{show ? 'X' : ''} 📊</Button>

      {!loading && posts.length > 0 && show && <OwnerStats posts={posts} show={show} />}

      <Container className="mt-4">
        <h3>Bienvenido/a {user.name},</h3>
        <p className="text-muted">Estas son tus publicaciones:</p>

        {loading ? (
          <p>Cargando publicaciones...</p>
        ) : posts.length === 0 ? (
          <p>No tienes publicaciones todavía.</p>
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
                  <td>${p.Property?.rentPrice}</td>
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

        <div className="mt-3">
          <Button
            variant="primary"
            onClick={() => navigate("/add-property/")}
          >
            + Agregar nueva propiedad
          </Button>
        </div>
      </Container>

      <ConfirmModal
        show={modalShow}
        title="Eliminar publicación"
        message="¿Seguro que querés eliminar esta publicación?"
        onConfirm={confirmDelete}
        onClose={() => setModalShow(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
