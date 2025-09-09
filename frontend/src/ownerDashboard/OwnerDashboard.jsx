import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function OwnerDashboard() {
    const [propiedades, setPropiedades] = useState([
        {
            id: 1,
            dirección: "9 de julio 1288",
            ambientes: 2,
            baños: 1,
            living: true,
            alquiler: 520000,
            expensas: 100000,
            estado: "Alquilado",
            descripcion: "Espacio amplio",
        },
        {
            id: 2,
            direccion: "27 de Febrero 1211",
            ambientes: 1,
            banos: 1,
            living: false,
            alquiler: 400000,
            expensas: 80000,
            estado: "Disponible",
            descripcion: "Ideal para estudiante",
        },
    ]);

    const totalPropiedades = propiedades.length;
    const totalAlquiladas = propiedades.filter(
        (p) => p.estado === "Alquilado"
    ).length;
    const ingresoMensual = propiedades
        .filter((p) => p.estado === "Alquilado")
        .reduce((acc, p) => acc + p.alquiler, 0);

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Dashboard de Propietario</h1>

            {/* KPIs */}
      <Row className="mb-4">
        <Col md={4}>
          <Card body className="text-center">
            <p>Total de propiedades</p>
            <h4>{totalPropiedades}</h4>
          </Card>
        </Col>
        <Col md={4}>
          <Card body className="text-center">
            <p>Total alquiladas</p>
            <h4>{totalAlquiladas}</h4>
          </Card>
        </Col>
        <Col md={4}>
          <Card body className="text-center">
            <p>Ingreso mensual estimado</p>
            <h4>${ingresoMensual.toLocaleString()}</h4>
          </Card>
        </Col>
      </Row>

      {/* Listado de propiedades */}
      <Row>
        {propiedades.map((prop) => (
          <Col md={6} key={prop.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{prop.direccion}</Card.Title>
                <Card.Text>
                  {prop.ambientes} Amb. | {prop.banos} baño
                  {prop.living ? " | Living y Comedor" : ""}
                </Card.Text>
                <Card.Text>
                  Alq: ${prop.alquiler.toLocaleString()} | Exp: $
                  {prop.expensas.toLocaleString()}
                </Card.Text>
                <Card.Text>
                  Estado:{" "}
                  <strong
                    style={{
                      color: prop.estado === "Alquilado" ? "green" : "orange",
                    }}
                  >
                    {prop.estado}
                  </strong>
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="primary">Gestionar</Button>
                  <Button variant="danger">Eliminar</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}