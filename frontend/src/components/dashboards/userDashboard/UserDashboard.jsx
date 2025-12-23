import React, { useEffect, useState, useContext } from "react";
import { Container, Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { AuthenticationContext } from "../../../services/auth.context";
import { rentalService } from "../../../services/rentalServices";
import Notifications from "../../ui/toaster/Notifications";

export default function UserDashboard() {
  const { userId, token } = useContext(AuthenticationContext);
  const [rent, setRent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Traer el alquiler del usuario
  useEffect(() => {
    const fetchRent = async () => {
      try {
        const data = await rentalService.getMyRent(token);

        console.log('Obtengo:', data);

        setRent(data);
      } catch (err) {
        console.error("Error al traer alquiler del inquilino:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRent();
  }, [userId, token]);

  console.log(userId);

  if (loading)
    return <p className="text-center mt-5">Cargando tu alquiler...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <Notifications />

      <Container className="mt-4">
        <h3 className="fw-bold">Mi Alquiler</h3>
        <p className="text-muted">Aquí podés ver tu propiedad alquilada.</p>

        {/* Si NO tiene alquiler */}
        {!rent ? (
          <Card className="p-4 shadow-sm text-center">
            <h5>No tenés ningún alquiler activo.</h5>
            <p>Explorá propiedades y encontrá tu nuevo hogar 🏠</p>
            <Button href="/properties" variant="primary">
              Ver Propiedades
            </Button>
          </Card>
        ) : (
          <>
            {/* CARD */}
            <Card className="shadow-sm rounded-4 mt-3 p-3">
              <Row className="g-0">
                {/* Imagen */}
                <Col
                  md={4}
                  className="d-flex align-items-center justify-content-center"
                >
                  {rent.Property?.images?.length > 0 ? (
                    <img
                      src={rent.Property.images[0]}
                      alt="Propiedad"
                      className="img-fluid rounded-3"
                    />
                  ) : (
                    <div className="bg-light rounded-3 text-center p-4 w-100">
                      <span className="text-muted">Sin imagen</span>
                    </div>
                  )}
                </Col>

                {/* Info */}
                <Col md={8}>
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="fw-bold mb-0">{rent.Property.title}</h4>
                      <span className="text-warning fw-bold">
                        {rent.Property.rating} ★
                      </span>
                    </div>

                    <p className="text-muted">{rent.Property.address}</p>

                    <p className="mb-1">
                      <strong>Ambientes:</strong> {rent.Property.rooms}
                    </p>

                    <p className="mb-1">
                      <strong>Baños:</strong> {rent.Property.bathrooms}
                    </p>

                    <p className="mb-1">{rent.Property.description}</p>

                    <hr />

                    <p className="mb-1">
                      <strong>Alquiler:</strong> $
                      {rent.Property.rentPrice.toLocaleString("es-AR")}
                    </p>

                    <p className="mb-1">
                      <strong>Expensas:</strong> $
                      {rent.Property.expensesPrice.toLocaleString("es-AR")}
                    </p>

                    <p className="mb-1">
                      <strong>Inicio:</strong>{" "}
                      {new Date(rent.Rental.startDate).toLocaleDateString()}
                    </p>

                    <p className="mb-3">
                      <strong>Fin:</strong>{" "}
                      {new Date(rent.Rental.endDate).toLocaleDateString()}
                    </p>

                    {/* Botones */}
                    <div className="mt-3">
                      <Button variant="danger" className="me-2">
                        Reportar
                      </Button>

                      <Button variant="outline-primary" className="me-2">
                        Ver Contrato
                      </Button>

                      {/* Datos del Propietario */}
                      <Button variant="secondary">
                        Propietario: {rent.Rental.owner.name}{" "}
                        {rent.Rental.owner.surname}
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
}
