import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faStar,
  faBuilding,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import "../../customStyle.css";

import { AuthenticationContext } from "../../services/auth.context";
import Step1 from "/public/illustrations/publish-steps/step-1.webp";
import Step2 from "/public/illustrations/publish-steps/step-2.webp";
import Step3 from "/public/illustrations/publish-steps/step-3.webp";

const PublishSteps = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthenticationContext);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (token) setIsLogged(true);
  }, [token]);

  const handleClick = () => {
    isLogged ? navigate("/add-property/location") : navigate("/create-account");
  };

  const steps = [
    { image: Step1, text: "Danos más detalles sobre la propiedad" },
    { image: Step2, text: "Subí fotos y videos" },
    { image: Step3, text: "Publicá sin costo" },
  ];

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

        <Row className="justify-content-center text-center align-items-stretch mb-5 gy-4">
          {steps.map((step, index) => (
            <Col key={index} xs={12} md={3} className="d-flex">
              <Card
                className="p-4 shadow-sm card-step w-100 border-0 rounded-4 position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #f8fcff 100%)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(0,123,255,0.05) 0%, transparent 70%)",
                    zIndex: 0,
                  }}
                ></div>

                <div className="position-relative mb-3" style={{ zIndex: 1 }}>
                  <span
                    className="badge rounded-circle position-absolute top-0 start-50 translate-middle fs-6"
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, var(--bs-info) 0%, var(--bs-primary) 100%)",
                      color: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      fontWeight: "600",
                    }}
                  >
                    {index + 1}
                  </span>

                  <div className="d-flex justify-content-center mt-4">
                    <img
                      src={step.image}
                      alt={`Paso ${index + 1}`}
                      style={{
                        height: "160px",
                        width: "auto",
                        objectFit: "contain",
                        filter: "drop-shadow(0px 0px 1px rgba(0, 0, 0, 1))",
                        transition: "transform 0.3s ease",
                      }}
                      className="step-image"
                    />
                  </div>
                </div>

                <Card.Body
                  className="d-flex flex-column justify-content-center"
                  style={{ zIndex: 1 }}
                >
                  <Card.Text className="fw-bold fs-6" style={{ color:"var(--bs-info-text-emphasis)" }}>
                    {step.text}
                  </Card.Text>
                  <small
                    className="text-white mb-2 fw-semibold fs-5 "
                    style={{
                      background: "var(--bs-primary)",
                      padding: "10px 15px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  >
                    Paso {index + 1}
                  </small>
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
              {isLogged
                ? "Registrá tu Propiedad"
                : "Iniciar Sesión y Registrá tu Propiedad"}{" "}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PublishSteps;
