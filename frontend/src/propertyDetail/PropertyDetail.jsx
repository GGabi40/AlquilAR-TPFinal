import { useState } from "react";
import { Card, Row, Col, Button, Table, Tabs, Tab, Carousel } from "react-bootstrap";

export default function PropertyDetail() {
    const [property] = useState({
        id: 1,
        titulo: "Departamento en San Lorenzo 1222",
        direccion: "San Lorenzo 1222, Rosario",
        precio: 600000,
        habitaciones: 3,
        baños: 2,
        superficie: "85 m²",
        imagenes: [
            "https://ar.pinterest.com/pin/1688918606491477/",
            "https://ar.pinterest.com/pin/2322237302315476/",
        ],
        inquilinos: [
            { nombre: "Juan Pérez", inicio: "2024-06-01", fin: "2025-06-01" },
            { nombre: "María López", inicio: "2023-03-01", fin: "2024-03-01" }
        ],
        gastos: [
            { concepto: "Expensas", monto: 8000 },
            { concepto: "Luz", monto: 1200 },
            { concepto: "Agua", monto: 500 }
        ],
    });

    return (
        <div className="p-4">

            <Row className="mb-3 align-items-center">
                <Col>
                    <h2>{property.titulo}</h2>
                    <p className="text-muted">{property.direccion}</p>
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                    <Button variant="primary">Editar propiedad</Button>
                </Col>
            </Row>

            <Carousel className="mb-4">
                {property.imagenes.map((img, idx) => (
                    <Carousel.Item key={idx}>
                        <img className="d-block w-100 rounded" src={img} alt={`Imagen ${idx + 1}`} />
                    </Carousel.Item>
                ))}
            </Carousel>

            <Tabs defaultActiveKey="detalles" className="mb-3">
                <Tab eventKey="detalles" title="Detalles">
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col><strong>Precio:</strong> ${property.precio}</Col>
                                <Col><strong>Habitaciones:</strong> {property.habitaciones}</Col>
                                <Col><strong>Baños:</strong> {property.baños}</Col>
                                <Col><strong>Superficie:</strong> {property.superficie}</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="inquilinos" title="Inquilinos">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {property.inquilinos.map((i, idx) => (
                                <tr key={idx}>
                                    <td>{i.nombre}</td>
                                    <td>{i.inicio}</td>
                                    <td>{i.fin}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>

                <Tab eventKey="gastos" title="Gastos">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Concepto</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {property.gastos.map((g, idx) => (
                                <tr key={idx}>
                                    <td>{g.concepto}</td>
                                    <td>${g.monto}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </div>
    );
}