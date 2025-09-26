import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import '../../customStyle.css';

// Usamos Bootstrap Icons (asegurate de tener el link en index.html)
const steps = [
  { icon: "bi-house", text: "Danos más detalles sobre la propiedad" },
  { icon: "bi-camera-video", text: "Subí fotos y videos" },
  { icon: "bi-megaphone", text: "Publicá sin costo" },
];

const Publicar = () => {
  return (
    <Container fluid className="py-5 bg-light">
      {/* Título */}
      <Row className="justify-content-center text-center mb-4">
        <Col md={8}>
          <h2 className="fw-bold">
            Publicá tu Propiedad y Encontrá tu Inquilino Ideal
          </h2>
          <p className="text-muted">Seguí estos simples pasos y empezá</p>
        </Col>
      </Row>

      {/* Pasos */}
      <Row className="justify-content-center text-center align-items-center mb-5 gy-4">
        {steps.map((step, index) => (
          <Col key={index} xs={12} md={3} className="d-flex">
            <Card className="p-3 shadow-sm card-step w-100">
              <div className="step-icon mb-3">
                <span className="badge bg-primary rounded-circle fs-6 me-2">
                  {index + 1}
                </span>
                <i className={`bi ${step.icon} fs-1 text-primary`}></i>
              </div>
              <Card.Body>
                <Card.Text className="fw-semibold">{step.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Botón CTA */}
      <Row className="justify-content-center text-center">
        <Col md={6}>
          <Button variant="primary" size="lg" className="w-100 fw-bold">
            Iniciar Sesión y Registrá tu Propiedad
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Publicar;
