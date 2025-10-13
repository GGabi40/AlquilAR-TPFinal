import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";

export const ErrorLayout = ({
  title = "Ocurrió un error",
  message = "Algo salió mal. Por favor, intenta nuevamente.",
  image,
  buttonText = "Volver al inicio",
  redirectTo = "/",
}) => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        minHeight: "calc(100vh - 160px)",
        padding: "2rem 1rem",
      }}
    >
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          {image && (
            <img
              src={image}
              alt={`Ilustración de error - ${title}`}
              className="img-fluid mb-4"
              style={{ maxHeight: "600px", objectFit: "contain" }}
            />
          )}
          <h2 className="fw-bold mb-3">{title}</h2>
          <p className="text-muted mb-4">{message}</p>
          <Button
            variant="primary"
            onClick={() => navigate(redirectTo)}
          >
            {buttonText}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
