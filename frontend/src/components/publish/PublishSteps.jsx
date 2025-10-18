import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "../../customStyle.css";

const steps = [
  { icon: "bi-house", text: "Danos más detalles sobre la propiedad" },
  { icon: "bi-camera-video", text: "Subí fotos y videos" },
  { icon: "bi-megaphone", text: "Publicá sin costo" },
];

const Publicar = () => {
  return (
    <>
      <section
        className="hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: "url('/public/photos/MoreInformation.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          height: "80vh",
          position: "relative",
        }}
      >
        <div
          className="overlay position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        ></div>

        <Container className="position-relative">
          <h1 className="fw-bold display-5 mb-3 text-white">
            ¡Mostrá tu propiedad al mundo!
          </h1>
          <p className="lead mb-4">
            Cargá los datos, subí tus fotos y encontrá inquilinos interesados en minutos.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="fw-bold px-4 py-2"
          >
            Empezá ahora
          </Button>
        </Container>
      </section>

      {/* Sección de pasos */}
      <Container fluid className="py-5 bg-light">
        <Row className="justify-content-center text-center mb-4">
          <Col md={8}>
            <h2 className="fw-bold">
              Publicá tu Propiedad y Encontrá tu Inquilino Ideal
            </h2>
            <p className="text-muted">Seguí estos simples pasos y empezá</p>
          </Col>
        </Row>

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

        <Row className="justify-content-center text-center">
          <Col md={6}>
            <Button variant="primary" size="lg" className="w-100 fw-bold">
              Iniciar Sesión y Registrá tu Propiedad
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Publicar;
