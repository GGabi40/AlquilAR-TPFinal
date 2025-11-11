import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, Button, Container, Row, Col, Form, Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { getPropertyById } from "../../services/propertyServices";

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: ""
    });

    /* useEffect(() => {
        const fetchProperty = async (id) => {
          try {
            setLoading(true);

            const results =  await getPropertyById(id);
            setProperty(results);
          } catch (error) {
            console.error("Error al obtener propiedades:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProperty(id);
      }, []); */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio";
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = "El nombre debe tener mínimo 3 caracteres";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.nombre)) {
            newErrors.nombre = "El nombre solo debe contener letras y espacios.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "El email no tiene un formato válido";
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = "El teléfono es obligatorio";
        } else if (!/^\d{8,15}$/.test(formData.telefono)) {
            newErrors.telefono = "Debe contener solo números (8 a 15 dígitos)";
        }

        if (!formData.mensaje.trim()) {
            newErrors.mensaje = "El mensaje es obligatorio";
        } else if (formData.mensaje.length < 10) {
            newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            alert("Tu mensaje fue enviado al propietario.");
            setFormData({
                nombre: "",
                email: "",
                telefono: "",
                mensaje: ""
            });
            setErrors({});
        }
    };

    return (
        <Container className="my-5">
            <Card className="p-4 shadow-sm position-relative rounded-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button type="button"
                        className="btn btn-outline-secondary ms-2"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>
                    <h4 className="m-0">{property.address}</h4>
                    <button
                        style={{ background: "transparent", border: "none" }}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <FontAwesomeIcon
                            icon={isFavorite ? faHeart : faHeartRegular}
                            style={{ color: "red" }}
                            size="lg"
                        />
                    </button>
                </div>

                {/* Carousel de imágenes */}
                <Carousel className="mb-4">
                    {property.image.map((img, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100 rounded-4"
                                src={img}
                                alt={`Imagen ${index + 1}`}
                                style={{ maxHeight: "400px", objectFit: "cover" }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* Datos principales */}
                <Row className="mb-3">
                    <Col md={8}>
                        <div className="mb-3">
                            <p>
                                <strong>Tipo:</strong> {property.type}
                            </p>
                            <p>
                                <strong>Precio:</strong> ${property.rentPrice}
                            </p>
                            <p>
                                <strong>Expensas:</strong> ${property.expensesPrice}
                            </p>
                            <p>
                                <strong>Ambientes:</strong> {property.PropertyDetail.numRooms}
                            </p>
                            <p>
                                <strong>Localidad:</strong> {property.PropertyLocality.name}
                            </p>
                            <p>
                                <strong>Provincia:</strong> {property.PropertyProvince.name}
                            </p>
                            <p>
                                <strong>Habitaciones:</strong> {property.PropertyDetail.numBedrooms}
                            </p>
                        </div>

                        <Card
                            className="shadow-sm p-3 w-100"
                            style={{
                                borderRadius: "16px",
                                backgroundColor: "#fff",
                            }}
                        >
                            <h6 className="text-center mb-3">Descripción</h6>
                            <p className="mb-0">{property.descripcion}</p>
                        </Card>
                    </Col>



                    <Col md={4} className="text-md-end">
                        {/* Formulario de contacto visible */}
                        <Card
                            className="shadow-sm p-3 mb-3"
                            style={{
                                borderRadius: "16px",
                                maxWidth: "360px",
                                marginLeft: "auto",
                                backgroundColor: "#fff",
                            }}
                        >
                            <h6 className="text-center mb-3">Contactar al propietario</h6>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        placeholder="Ej: Juan García"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        isInvalid={!!errors.nombre}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
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
                                        name="telefono"
                                        placeholder="Ej: 341 2567890"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        isInvalid={!!errors.telefono}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.telefono}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Mensaje</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="mensaje"
                                        placeholder="Escribe tu mensaje..."
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        isInvalid={!!errors.mensaje}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.mensaje}
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

                        <Card
                            className="shadow p-3"
                            style={{
                                borderRadius: "16px",
                                maxWidth: "360px",
                                marginLeft: "auto",
                                backgroundColor: "#fff",
                            }}
                        >
                            <h6 className="text-center mb-3">Información del Propietario</h6>
                            <p className="mb-1">Nombre: {property.owner?.nombre || "No disponible"}</p>
                        </Card>
                    </Col>
                </Row>

                {/* Rating */}
                <div className="text-end">
                    <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} /> Rating
                </div>
            </Card>
        </Container>
    );
};

export default PropertyDetail;