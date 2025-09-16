import React, { useEffect, useState } from "react";
import { Nav, Navbar, Container, Tab, Tabs, Table, Button } from "react-bootstrap";


export default function SuperadminDashboard() {
    const [key, setKey] = useState("usuarios");
    const [usuarios, setUsuarios] = useState([]);
    const [propiedades, setPropiedades] = useState([]);
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleFeatured = async (id, currentValue) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/properties/${id}/featured`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ featured: !currentValue }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message);
            }

            const update = await res.json();

            setPropiedades((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, featured: update.property.featured } : p
                )
            );
        } catch (error) {
            console.error("Error al cambiar destacado:", error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
              const token = localStorage.getItem("token");

              const resUsers = await fetch("http://localhost:3000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
              });
              const dataUsers = await resUsers.json();
              if (!resUsers.ok) throw new Error(dataUsers.message);
              setUsuarios(dataUsers);

              const resProps = await fetch("http://localhost:3000/api/properties", {
                headers: { Authorization: `Bearer ${token}` },
              });
              const dataProps = await resProps.json();
              if(!resProps.ok) throw new Error(dataProps.message);
              setPropiedades(dataProps);

              setPendientes([
                { id: 1, fecha: "01/09/2025", documento: "Contrato.pdf", propietario: "Pedro López" },
                    { id: 2, fecha: "05/09/2025", documento: "Escritura.pdf", propietario: "Ana Torres" },
                ]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

                <Tabs id="superadmin-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mt-3 mb-3">
                    <Tab eventKey="usuarios" title="Usuarios">
                        {loading ? (
                            <p>Cargando usuarios...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
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
                        )}
                    </Tab>

                    <Tab eventKey="propiedades" title="Propiedades">
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Ubicación</th>
                                    <th>Correo de Propietario</th>
                                    <th>Disponible</th>
                                    <th>N° Reportes</th>
                                    <th>Destacada</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {propiedades.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.location}</td>
                                        <td>{p.owner?.correo || "N/A"}</td>
                                        <td>{p.avaiable ? "Si" : "No"}</td>
                                        <td>
                                            <button
                                                size="sm"
                                                variant={p.featured ? "success" : "secondary"}
                                                onClick={() => toggleFeatured(p.id, p.featured)}
                                            >
                                                {p.featured ? "Quitar" : "Destacar"}
                                            </button>
                                        </td>
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