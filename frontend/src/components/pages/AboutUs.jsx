import React, { useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm p-4 login-form">
                        <Card.Body>
                            <h2 className="mb-4 text-center">¿Quiénes Somos?</h2>
                            <p>
                                <strong>AlquilAR</strong> es una aplicación pensada para transformar la
                                forma en que se alquilan propiedades en Argentina. Nuestro propósito es
                                crear un espacio digital donde propietarios e inquilinos puedan
                                conectarse de manera directa, rápida y segura.
                            </p>
                            <p>
                                El equipo de desarrollo está conformado por estudiantes de la{" "}
                                <strong>Tecnicatura Universitaria en Programación</strong> de la{" "}
                                <strong>UTN - Facultad Regional Rosario</strong>:
                            </p><br />

                            <Row className="mb-4 justify-content-center g-4">
                                {[
                                    { nombre: "Baptista Gabriela", rol: "Fullstack", emoji: "👩‍💻" },
                                    { nombre: "Calvo Celeste", rol: "Fullstack", emoji: "👩‍💻" },
                                    { nombre: "Ríos Elena", rol: "Fullstack", emoji: "👩‍💻" },
                                ].map((member, idx) => (
                                    <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                                        <Card className="text-center shadow-sm h-100">
                                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                                <div style={{ fontSize: "3rem" }}>{member.emoji}</div>
                                                <Card.Title className="mt-2">{member.nombre}</Card.Title>
                                                <Card.Text className="text-muted">{member.rol}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <br /><p>
                                Nuestra misión es simplificar el proceso de alquiler, ofreciendo una
                                plataforma accesible y transparente que brinde confianza a ambas
                                partes. Creemos en la tecnología como herramienta para generar nuevas
                                oportunidades y mejorar la experiencia de quienes buscan un hogar.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;