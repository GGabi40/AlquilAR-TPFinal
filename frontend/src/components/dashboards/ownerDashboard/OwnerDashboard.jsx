import React from "react";
import { Navbar, Container, Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import usePagination from "../../../hooks/usePagination.js";
import { PostService } from "../../../services/PostService.js";

export default function OwnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { data: posts,
    loading,
    loadMore,
    hasMore,
    setData,
  } = usePagination(`/posts/owner/${user.id}`);

  const handlePauseResume = async (post) => {
    const newStatus = post.status === "active" ? "paused" : "active";
    try {
      await PostService.updateStatus(post.id, newStatus, token);
      setData((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado de la publicación.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta publicación?")) return;
    try {
      await PostService.deletePost(id, token);
      setData((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      alert("No se pudo eliminar la publicación.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/posts/edit/${id}`);
  };

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
        <Container fluid>
          <Navbar.Brand>AlquilAR</Navbar.Brand>
          <div className="d-flex align-items-center text-white">
            <span className="me-2">{user?.name} ({user?.role})</span>
          </div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h3>Bienvenido/a {user?.name},</h3>
        <p className="text-muted">Estas son tus publicaciones:</p>

        {loading && propiedades.length === 0 ? (
          <p>Cargando propiedades...</p>
        ) : propiedades.length === 0 ? (
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
              {propiedades.map((p) => (
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
    </div>
  );
}
