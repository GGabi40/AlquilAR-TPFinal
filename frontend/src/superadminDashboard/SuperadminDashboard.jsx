import React, { useState } from "react";
import { Nav, Navbar, Container, Tab, Tabs, Table, Button } from "react-bootstrap";


export default function SuperadminDashboard() {
    const [key, setKey] = useState("usuarios");

    const usuarios = [
        { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@mail.com", rol: "Inquilino" },
        { id: 2, nombre: "María", apellido: "Gómez", correo: "maria@mail.com", rol: "Propietario" },
    ];

    const propiedades = [
        { id: 1, ubicacion: "San Martín 123", correo: "prop1@mail.com", disponible: "Sí", reportes: 2 },
        { id: 2, ubicacion: "Belgrano 456", correo: "prop2@mail.com", disponible: "No", reportes: 0 },
    ];

    const pendientes = [
        { id: 1, fecha: "01/09/2025", documento: "Contrato.pdf", propietario: "Pedro López" },
        { id: 2, fecha: "05/09/2025", documento: "Escritura.pdf", propietario: "Ana Torres" },
    ];

    return (
        <div>
            <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
                <Container fluid>
                    <Navbar.Brand>AlquilAR</Navbar.Brand>
                    <div className="d-flex align-items-center text-white">
                        <span className="me-2">Super Admin</span>
                        <div className="rounded-circle bg-light" style={{ width: "30px", height: "30px" }}></div>
                    </div>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <h3>Bienvenido/a Super Admin,</h3>

                <Tabs
                    id="superadmin-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mt-3 mb-3"
                >
                    <Tab eventKey="usuarios" title="Usuarios">
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo Electrónico</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.nombre}</td>
                                        <td>{u.apellido}</td>
                                        <td>{u.correo}</td>
                                        <td>{u.rol}</td>
                                        <td>
                                            <Button size="sm" variant="warning" className="me-2">Editar</Button>
                                            <Button size="sm" variant="danger">Eliminar</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>

                    <Tab eventKey="propiedades" title="Propiedades">
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Ubicación</th>
                                    <th>Correo de Propietario</th>
                                    <th>Disponible</th>
                                    <th>N° Reportes</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {propiedades.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.ubicacion}</td>
                                        <td>{p.correo}</td>
                                        <td>{p.disponible}</td>
                                        <td>{p.reportes}</td>
                                        <td>
                                            <Button size="sm" variant="info" className="me-2">Ver</Button>
                                            <Button size="sm" variant="danger">Eliminar</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>

                    <Tab eventKey="pendientes" title="Pendientes">
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Fecha Publicación</th>
                                    <th>Documento Publicado</th>
                                    <th>Datos Propietario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendientes.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.fecha}</td>
                                        <td>{p.documento}</td>
                                        <td>{p.propietario}</td>
                                        <td>
                                            <Button size="sm" variant="success" className="me-2">Aprobar</Button>
                                            <Button size="sm" variant="danger">Rechazar</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
}