import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        mensaje: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio.";
        } else if (formData.nombre.trim().length < 3) {
            newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!regexEmail.test(formData.email)) {
            newErrors.email = "El formato del correo electrónico debe ser válido.";
        }

        if (!formData.mensaje.trim()) {
            newErrors.mensaje = "El mensaje no puede estar vacío.";
        } else if (formData.mensaje.length > 200) {
            newErrors.mensaje = "El mensaje no puede superar los 200 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        console.log("Formulario enviado:", formData);
        setSubmitted(true);
        setFormData({ nombre: "", email: "", mensaje: "" });
    };

    return (
        <Container className="py-5">
            <Card className="shadow-sm p-4">
                <Card.Body>
                    <h2 className="mb-4 text-center">Contáctanos</h2>
                    <p className="text-center">
                        Si querés comunicarte con nosotros o con un propietario, completá el formulario y te responderemos a la brevedad.
                    </p>

                    {submitted && (
                        <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                            ¡Mensaje enviado correctamente! Gracias por contactarnos.
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                isInvalid={!!errors.nombre}
                            />
                            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="mensaje">
                            <Form.Label>Mensaje</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Escribí tu mensaje aquí..."
                                isInvalid={!!errors.mensaje}
                            />
                            <Form.Control.Feedback type="invalid">{errors.mensaje}</Form.Control.Feedback>
                            <div
                                className="text-end"
                                style={{
                                    color: formData.mensaje.length > 200 ? "#e04f5dff" : formData.mensaje.length > 180 ? "#e8ad4eff" : "#74abb1ff"
                                }}
                            >
                                {formData.mensaje.length} / 200
                            </div>
                        </Form.Group>

                        <div className="text-center">
                            <Button type="submit" variant="primary">
                                Enviar Mensaje
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ContactUs;