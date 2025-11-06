import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, Button, Container, Row, Col, Form, Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

const properties = [
    {
        id: 1,
        titulo: "San Lorenzo 1222",
        tipo: "Departamento",
        direccion: "San Lorenzo 1222",
        precio: 60000,
        expensas: 2000,
        servicios: ["Luz", "Gas"],
        hab: 3,
        img: [
            "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D",
            "https://via.placeholder.com/600x400?text=Imagen+2",
            "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D"
        ],
        localidad: "Rosario",
        provincia: "Santa Fe",
        descripcion: "Hermoso departamento con balcón. Viene de publicación."
    },
];

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const property = properties.find(p => p.id === parseInt(id)) || properties[0];
    const [isFavorite, setIsFavorite] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Tu mensaje fue enviado al propietario.");
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
                    <h4 className="m-0">{property.direccion}</h4>
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
                    {property.img.map((img, index) => (
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
                                <strong>Tipo:</strong> {property.tipo}
                            </p>
                            <p>
                                <strong>Precio:</strong> ${property.precio}
                            </p>
                            <p>
                                <strong>Expensas:</strong> ${property.expensas}
                            </p>
                            <p>
                                <strong>Servicios:</strong> {property.servicios.join(" ")}
                            </p>
                            <p>
                                <strong>Ambientes:</strong> {property.ambientes}
                            </p>
                            <p>
                                <strong>Localidad:</strong> {property.localidad}
                            </p>
                            <p>
                                <strong>Provincia:</strong> {property.provincia}
                            </p>
                            <p>
                                <strong>Habitaciones:</strong> {property.hab}
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
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Mensaje</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        required
                                    />
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