import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, Button, Container, Carousel, Row, Col, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const properties = [
    { id: 1, titulo: "San Lorenzo 1222", tipo: "Departamento", direccion: "Córdoba 3423, Argentina", precio: 600000, hab: 3, img: "https://via.placeholder.com/600x400", localidad: "Rosario", provincia: "Santa Fe", descripcion: "Hermoso departamento con balcón." },
    { id: 2, titulo: "Av. Siempre Viva 742", tipo: "Casa", direccion: "Buenos Aires 5454, Argentina", precio: 450000, hab: 2, img: "https://via.placeholder.com/600x400", localidad: "Rio Cuarto", provincia: "Cordoba", descripcion: "Casa con patio amplio y garage." },
    { id: 3, titulo: "Casa con Patio", tipo: "Casa", direccion: "Calle Falsa 123, Córdoba", precio: 850000, hab: 4, img: "https://via.placeholder.com/600x400?text=Casa+con+Patio", localidad: "CABA", provincia: "Buenos Aires", descripcion: "Gran casa familiar con jardín trasero." }
];

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const property = properties.find(p => p.id === parseInt(id));

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: ""
    });

    const images = [property.img];

    if (!property) {
        return <h2 className="text-center mt-5">¡Lo sentimos! Propiedad no encontrada</h2>;
    }

    const [isFavorite, setIsFavorite] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/api/contact", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, propertyId: property.id, }), 
            });

            if (!response.ok) {
                throw new Error("Error al enviar el mensaje");
            }

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            alert("Tu mensaje fue enviado al propietario.");
            setShowModal(false);
            setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al enviar el mensaje.");
        }
    };

    return (
        <Container className="my-5">
            <Card className="shadow p-3">
                <Row>
                    <Col md={6}>
                        <Carousel>
                            {images.map((img, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={img}
                                        alt={`Propiedad ${index + 1}`}
                                        style={{ maxHeight: "400px", objectFit: "cover" }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>

                    <Col md={6}>
                        <Card.Body>
                            <Card.Title>{property.titulo}</Card.Title>
                            <button
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                                onClick={() => setIsFavorite(!isFavorite)}
                            >
                                <FontAwesomeIcon
                                    icon={isFavorite ? faHeart : faHeartRegular}
                                    style={{ color: "red", cursor: "pointer" }}
                                    size="lg"
                                />
                            </button>
                            <Card.Text>
                                <strong>Dirección:</strong> {property.direccion} <br />
                                <strong>Precio:</strong> ${property.precio} <br />
                                <strong>Habitaciones:</strong> {property.hab} <br />
                                <strong>Provincia:</strong> {property.provincia} <br />
                                <strong>Localidad:</strong> {property.localidad} <br />
                            </Card.Text>
                            <p>{property.descripcion}</p>
                            <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
                                ⬅ Volver
                            </Button>
                            <Button variant="primary" onClick={() => setShowModal(true)}>Contactar Propietario</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Contactar al propietario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mensaje</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary">Enviar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PropertyDetail;