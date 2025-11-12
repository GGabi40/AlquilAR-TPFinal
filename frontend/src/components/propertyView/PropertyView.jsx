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

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        message: ""
    });

    const getCoordinates = async (address, locality, province) => {
        if (!address && !locality && !province) return null;

        const query = `${address || ""}, ${locality || ""}, ${province || ""}, Argentina`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.length > 0) {
                // Pequeña variación aleatoria para no mostrar el punto exacto (hasta 100 m aprox)
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
                setErrors(null);

                const propertyData = await getPropertyById(id);
                console.log("datos recibidos: ", propertyData);

                //esto agregue
                const coords = await getCoordinates(
                    propertyData.address,
                    propertyData.locality?.name,
                    propertyData.province?.name
                );

                if (coords) {
                    propertyData.latitude = coords.lat;
                    propertyData.longitude = coords.lon;
                }
                //hasta aca

                setProperty(propertyData);
            } catch (error) {
                console.error("Error al obtener propiedades:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensaje enviado al propietario ✅");
    setFormData({ username: "", email: "", phone: "", message: "" });
  };

  if (loading) return <p className="text-center mt-5">Cargando propiedad...</p>;
  if (!property)
    return <p className="text-center mt-5">Propiedad no encontrada.</p>;

  return (
    <Container className="my-5">
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
          <FontAwesomeIcon icon={isFavorite ? faHeart : faHeartRegular} size="xl" />
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
                    filter: "brightness(90%)",
                  }}
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
            {property.latitude && property.longitude && (
                        <div className="mt-4">
                            <h6>Ubicación aproximada</h6>
                            <MapContainer
                                center={[property.latitude, property.longitude]}
                                zoom={15}
                                style={{ height: "300px", width: "100%", borderRadius: "16px" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker
                                    position={[property.latitude, property.longitude]}
                                    icon={L.icon({
                                        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
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
          <Card className="shadow-sm border-0 p-4 rounded-4">
            <h5 className="fw-bold text-center mb-3">Contactar al propietario</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Nombre completo"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="message"
                  placeholder="Tu mensaje..."
                  value={formData.message}
                  onChange={handleChange}
                  isInvalid={!!errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" className="w-100 rounded-3" type="submit">
                Enviar mensaje
              </Button>
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
