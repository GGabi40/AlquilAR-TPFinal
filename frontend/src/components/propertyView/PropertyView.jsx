import React, { useEffect, useState } from "react";
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
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { getPropertyById } from "../../services/propertyServices";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import Notifications, { toastError, toastSuccess } from "../ui/toaster/Notifications";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // 📸 Lightbox
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // 🌎 Geolocalización aproximada
  const getCoordinates = async (address, locality, province) => {
    if (!address && !locality && !province) return null;

    const query = `${address || ""}, ${locality || ""}, ${province || ""
      }, Argentina`;
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setErrors({});
        const propertyData = await getPropertyById(id);

        const coords = await getCoordinates(
          propertyData.address,
          propertyData.locality?.name,
          propertyData.province?.name
        );

        if (coords) {
          propertyData.latitude = coords.lat;
          propertyData.longitude = coords.lon;
        }
        setProperty(propertyData);
      } catch (error) {
        console.error("Error al obtener propiedad:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener mínimo 3 caracteres";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo debe contener letras y espacios.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Debe contener solo números (8 a 15 dígitos)";
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    } else if (formData.message.length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log(formData);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/contact/${property.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error enviando mensaje");

      toastSuccess("¡Enviamos tu mensaje con éxito!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});

    } catch (error) {
      console.error(error);
      toastError(
        error.response?.data?.message || "Error al enviar el email."
      );
    }
  };

  // Lightbox handlers
  const handleImageClick = (url) => {
    setSelectedImage(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  if (loading) return <p className="text-center mt-5">Cargando propiedad...</p>;
  if (!property)
    return <p className="text-center mt-5">Propiedad no encontrada.</p>;

  return (
    <Container className="my-5">
      <Notifications />
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
        <h3 className="fw-bold mb-0 text-primary">
          {property.address || "Dirección no disponible"}
        </h3>
        <Button
          variant="link"
          onClick={() => setIsFavorite(!isFavorite)}
          style={{ color: isFavorite ? "red" : "#aaa" }}
        >
          <FontAwesomeIcon
            icon={isFavorite ? faHeart : faHeartRegular}
            size="xl"
          />
        </Button>
      </div>

      {/* IMÁGENES */}
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
                    filter: "brightness(90%)",
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

      {/* Lightbox */}
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

      {/* INFO PRINCIPAL */}
      <Row className="g-4">
        <Col md={8}>
          <Card className="shadow-sm border-0 p-4 rounded-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="fw-bold text-dark">
                {property.propertyType || "Propiedad"}
              </h4>
              <Badge bg="success" className="fs-6">
                ${property.rentPrice}
              </Badge>
            </div>

            <p className="text-muted mb-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
              {property.locality?.name}, {property.province?.name}
            </p>

            <div className="d-flex flex-wrap gap-3 mb-3">
              <span>
                <FontAwesomeIcon icon={faHome} />{" "}
                {property.PropertyDetail?.numRooms || "N/A"} ambientes
              </span>
              <span>
                <FontAwesomeIcon icon={faBed} />{" "}
                {property.PropertyDetail?.numBedrooms || "N/A"} habitaciones
              </span>
              <span>
                <FontAwesomeIcon icon={faBath} />{" "}
                {property.PropertyDetail?.numBathrooms || "N/A"} baños
              </span>
            </div>

            <h6 className="fw-bold">Descripción</h6>
            <p className="text-secondary">
              {property.PropertyDetail?.description ||
                "Sin descripción disponible."}
            </p>

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
                  title="Video de la propiedad"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-4 shadow-sm"
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
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
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

        {/* CONTACTO */}
        <Col md={4}>
          <Card
            className="shadow-sm p-3 mb-3 border-0"
            style={{
              borderRadius: "16px",
              backgroundColor: "#fff",
            }}
          >
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
                <button
                  className="btn ms-2 btn-outline-primary"
                  type="submit"
                  style={{
                    fontWeight: "500",
                  }}
                >
                  Enviar
                </button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* FOOTER */}
      <div className="text-end mt-4">
        <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />{" "}
        <small>4.8 / 5 basado en reseñas</small>
      </div>
    </Container>
  );
};

export default PropertyDetail;
