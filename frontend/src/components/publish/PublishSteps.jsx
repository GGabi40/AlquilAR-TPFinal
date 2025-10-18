import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faStar,
  faBuilding,
  faHandHoldingHeart,
  faHouse,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import "../../customStyle.css";

import { AuthenticationContext } from "../../services/auth.context";

const PublishSteps = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthenticationContext);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if(token) setIsLogged(true);
  }, [token]);

  const handleClick = () => {
    isLogged ? navigate("/add-property/location") : navigate("/create-account");
  };

  const steps = [
    { icon: faHouse, text: "Danos más detalles sobre la propiedad" },
    { icon: faVideoCamera, text: "Subí fotos y videos" },
    { icon: faBullhorn, text: "Publicá sin costo" },
  ]; // agg imagenes

  const beneficios = [
    {
      icon: faBullhorn,
      text: "Tu publicación llega a miles de inquilinos potenciales",
    },
    { icon: faStar, text: "Podés destacar tu propiedad fácilmente" },
    {
      icon: faBuilding,
      text: "Gestioná tus propiedades desde un solo lugar",
    },
    {
      icon: faHandHoldingHeart,
      text: "Publicar es totalmente gratuito y rápido",
    },
  ];

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
            Cargá los datos, subí tus fotos y encontrá inquilinos interesados en
            minutos.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="fw-bold px-4 py-2"
            onClick={handleClick}
          >
            Empezá ahora
          </Button>
        </Container>
      </section>

      <section className="benefits-section py-5 bg-white">
        <Container>
          <Row className="justify-content-center text-center mb-4">
            <Col md={10}>
              <hr className="dotted-line mb-5" />
              <Row className="gy-4">
                {beneficios.map((item, index) => (
                  <Col key={index} xs={12} md={3}>
                    <p className="fw-semibold text-muted small-benefit">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="text-primary me-2 fs-4"
                      />
                      {item.text}
                    </p>
                  </Col>
                ))}
              </Row>
              <hr className="dotted-line mt-5" />
            </Col>
          </Row>
        </Container>
      </section>

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
                  <FontAwesomeIcon
                    icon={step.icon}
                    className="text-primary me-2 fs-4"
                  />
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
            <Button
              variant="primary"
              size="lg"
              className="w-100 fw-bold"
              onClick={handleClick}
            >
              {isLogged ? "Registrá tu Propiedad" : "Iniciar Sesión y Registrá tu Propiedad"}
              {" "}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PublishSteps;
