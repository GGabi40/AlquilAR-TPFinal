import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Carousel,
  Button,
  Badge,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartRegular,
  faStar,
  faHome,
  faBed,
  faBath,
  faMapMarkerAlt,
  faCircleCheck,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

import { PostService } from "../../services/PostService";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";

import Notifications, { toastError, toastSuccess } from "../ui/toaster/Notifications";
import { AuthenticationContext } from "../../services/auth.context";
import axios from "axios";
import { formatApproxAddress } from "../../services/formatAddress";

const PropertyDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  // Estados
  const [post, setPost] = useState(null);
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Formulario de contacto
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // -------------------------
  // GEOLOCALIZACIÓN
  // -------------------------
  const getCoordinates = async (address, locality, province) => {
    if (!address && !locality && !province) return null;

    const query = `${address || ""}, ${locality || ""}, ${province || ""}, Argentina`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat) + (Math.random() - 0.5) * 0.001;
        const lon = parseFloat(data[0].lon) + (Math.random() - 0.5) * 0.001;
        return { lat, lon };
      }
      return null;
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
      return null;
    }
  };

  // -------------------------
  // USE EFFECT → TRAER EL POST
  // -------------------------
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setErrors({});

        const postData = await PostService.getPostById(id);

        // Geolocalización
        const coords = await getCoordinates(
          formatApproxAddress(postData.property.address),
          postData.property.locality?.name,
          postData.property.province?.name
        );

        if (coords) {
          postData.property.latitude = coords.lat;
          postData.property.longitude = coords.lon;
        }

        setPost(postData);
        setProperty(postData.property);
      } catch (error) {
        console.error("Error al obtener post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // -------------------------
  // FORM CONTACTO
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    else if (formData.name.length < 3) newErrors.name = "Debe tener mínimo 3 caracteres";

    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Formato inválido";

    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio";
    else if (!/^\d{8,15}$/.test(formData.phone))
      newErrors.phone = "Solo números (8 a 15 dígitos)";

    if (!formData.message.trim()) newErrors.message = "El mensaje es obligatorio";
    else if (formData.message.length < 10)
      newErrors.message = "Debe tener al menos 10 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (!token) return toastError("Debes iniciar sesión para enviar un mensaje.");

      const API_URL = import.meta.env.VITE_BACKEND_ROUTE;

      await axios.post(`${API_URL}/contact/${property.ownerId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toastSuccess("¡Mensaje enviado con éxito!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      toastError("Error al enviar el email.");
    }
  };

  // -------------------------
  // LIGHTBOX
  // -------------------------
  const handleImageClick = (url) => {
    setSelectedImage(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  // -------------------------
  // LOADING / ERROR
  // -------------------------
  if (loading) return <p className="text-center mt-5">Cargando propiedad...</p>;
  if (!property || !post)
    return <p className="text-center mt-5">Propiedad no encontrada.</p>;

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <Container className="my-5">
      <Notifications />

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Volver
        </Button>

        <h3 className="fw-bold mb-0 text-primary">{formatApproxAddress(property.address)}</h3>

        <Button
          variant="link"
          onClick={() => setIsFavorite(!isFavorite)}
          style={{ color: isFavorite ? "red" : "#aaa" }}
        >
          <FontAwesomeIcon icon={isFavorite ? faHeart : faHeartRegular} size="xl" />
        </Button>
      </div>

      {/* BADGE ESTADO */}
      <Badge
        bg={
          post.status === "active"
            ? "success"
            : post.status === "rented"
            ? "danger"
            : "secondary"
        }
        className="px-3 py-2 mb-3"
      >
        <FontAwesomeIcon icon={faCircleCheck} />{" "}
        {post.status === "active"
          ? "Disponible"
          : post.status === "rented"
          ? "Alquilado"
          : "Pausado"}
      </Badge>

      {/* CARRUSEL IMÁGENES */}
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden mb-4">
        <Carousel>
          {property.PropertyDetail?.PropertyImages?.length > 0 ? (
            property.PropertyDetail.PropertyImages.map((img, index) => (
              <Carousel.Item key={index}>
                <img
                  src={img.URLImages}
                  alt={`Imagen ${index + 1}`}
                  className="d-block w-100"
                  style={{
                    height: "450px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(img.URLImages)}
                />
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <img
                src="/photos/no-image.png"
                alt="Sin imágenes"
                className="d-block w-100"
                style={{ height: "450px", objectFit: "cover" }}
              />
            </Carousel.Item>
          )}
        </Carousel>
      </Card>

      {/* LIGHTBOX */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="xl">
        <Modal.Body className="bg-dark text-center p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="img-fluid"
              style={{
                maxHeight: "90vh",
                width: "auto",
                borderRadius: "12px",
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      <Row className="g-4">
        {/* INFORMACIÓN PRINCIPAL */}
        <Col md={8}>
          <Card className="shadow-sm border-0 p-4 rounded-4 mb-4">
            <h4 className="fw-bold">{post.title}</h4>

            <p className="text-secondary">{post.description}</p>

            <h5 className="fw-bold text-primary mb-3">Información de la propiedad</h5>

            <p className="text-muted">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.locality?.name},{" "}
              {property.province?.name}
            </p>

            {/* DETALLES */}
            <div className="d-flex flex-wrap gap-3 mb-3">
              <span>
                <FontAwesomeIcon icon={faHome} /> {property.PropertyDetail?.numRooms}{" "}
                ambientes
              </span>
              <span>
                <FontAwesomeIcon icon={faBed} /> {property.PropertyDetail?.numBedrooms}{" "}
                habitaciones
              </span>
              <span>
                <FontAwesomeIcon icon={faBath} /> {property.PropertyDetail?.numBathrooms}{" "}
                baños
              </span>
            </div>

            {/* VIDEO */}
            {property.PropertyDetail?.PropertyVideos?.length > 0 && (
              <div className="text-center mt-4">
                <h6 className="fw-bold mb-3">
                  <FontAwesomeIcon icon={faVideo} /> Video de la Propiedad
                </h6>

                <iframe
                  width="100%"
                  height="400"
                  src={property.PropertyDetail.PropertyVideos[0].URLVideo?.replace(
                    "watch?v=",
                    "embed/"
                  )?.replace("youtu.be/", "www.youtube.com/embed/")}
                  className="rounded-4 shadow-sm"
                  allowFullScreen
                />
              </div>
            )}

            {/* MAPA */}
            {property.latitude && property.longitude && (
              <div className="mt-4">
                <h6>Ubicación aproximada</h6>

                <MapContainer
                  center={[property.latitude, property.longitude]}
                  zoom={15}
                  style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: "16px",
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[property.latitude, property.longitude]}
                    icon={L.icon({
                      iconUrl:
                        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                      shadowUrl:
                        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                    })}
                  />
                  <Circle
                    center={[property.latitude, property.longitude]}
                    radius={100}
                    pathOptions={{ color: "blue", fillOpacity: 0.2 }}
                  />
                </MapContainer>

                <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                  📍 Dirección aproximada
                </p>
              </div>
            )}
          </Card>
        </Col>

        {/* CONTACTAR AL PROPIETARIO */}
        <Col md={4}>
          <Card className="shadow-sm p-3 border-0" style={{ borderRadius: "16px" }}>
            <h6 className="text-center mb-3">Contactar al propietario</h6>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Ej: Juan García"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="tuemail@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Ej: 341 2567890"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="message"
                  placeholder="Escribe tu mensaje..."
                  value={formData.message}
                  onChange={handleChange}
                  isInvalid={!!errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <button className="btn btn-outline-primary" type="submit">
                  Enviar
                </button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      <div className="text-end mt-4">
        <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />{" "}
        <small>4.8 / 5 basado en reseñas</small>
      </div>
    </Container>
  );
};

export default PropertyDetail;
