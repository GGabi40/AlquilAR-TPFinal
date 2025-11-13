import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Form,
  Button,
  Container,
  Card,
  Spinner,
} from "react-bootstrap";

import { PostService } from "../../../services/PostService.js";
import { AuthenticationContext } from "../../../services/auth.context.jsx";
import Notifications, {
  toastError,
  toastSuccess,
} from "../../ui/toaster/Notifications.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import PropertyMiniEditor from "./PropertyMiniEditor.jsx";
import TenantAsignament from "./TenantAsignament.jsx";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthenticationContext);

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "paused",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await PostService.getPostById(id, token);
        setPost(data);

        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          status: data.status ?? "paused",
        });
      } catch (error) {
        toastError("Error al cargar la publicación.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await PostService.updatePost(id, form, token);
      toastSuccess("Publicación actualizada");

      setTimeout(() => {
        navigate("/owner/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toastError("Error al guardar los cambios");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> <p>Cargando publicación...</p>
      </div>
    );

  return (
    <Container className="mt-5" style={{ maxWidth: "900px" }}>
      <Notifications />

      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle shadow-sm"
          style={{
            width: "90px",
            height: "90px",
            background: "#ffffff",
          }}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="dashboard-fa-icon" />
        </div>
        <h2 className="fw-bold mt-3">Editar Publicación</h2>
        <p className="text-muted">Modificá los datos de tu anuncio.</p>
      </div>

      <Card className="shadow-sm p-4 border-0 rounded-4">
        <div className="text-center mb-4">
          <hr
            style={{
              width: "40%",
              margin: "0 auto",
              opacity: 0.3,
            }}
          />
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Título</Form.Label>
            <Form.Control
              className="rounded-3 shadow-sm"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Descripción</Form.Label>
            <Form.Control
              className="rounded-3 shadow-sm"
              as="textarea"
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Estado del anuncio</Form.Label>
            <Form.Select
              className="rounded-3 shadow-sm"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="paused">⏸ Pausada</option>
              <option value="active">🟢 Activa</option>
              <option value="rented">🏠 Alquilada</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-3 mt-4">
            <Button
              type="submit"
              variant="success"
              className="px-4 py-2 rounded-3"
              onClick={handleSubmit}
            >
              Guardar cambios
            </Button>

            <Button
              variant="outline-danger"
              className="px-4 py-2 rounded-3"
              onClick={() => navigate("/owner/dashboard")}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>

      <hr className="my-5" style={{ opacity: 0.15 }} />
      <h4 className="fw-bold mb-3">Asignar inquilino</h4>
      <TenantAsignament />

      <hr className="my-5" style={{ opacity: 0.15 }} />

      <h4 className="fw-bold mb-3 text-center">Datos de la Propiedad</h4>
      <PropertyMiniEditor propertyId={post?.Property?.idProperty} />
    </Container>
  );
}
