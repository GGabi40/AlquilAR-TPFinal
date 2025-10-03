import React, { useState, useEffect } from "react";
import { Navbar, Container, Tabs, Tab, Table, Button, Spinner } from "react-bootstrap";
import usePagination from "../../hooks/usePagination";

export default function SuperadminDashboard() {
  const [key, setKey] = useState("usuarios");
  const [usuarios, setUsuarios] = useState([]);
  const [pendientes, setPendientes] = useState([
    { id: 1, fecha: "01/09/2025", documento: "Contrato.pdf", propietario: "Pedro López" },
    { id: 2, fecha: "05/09/2025", documento: "Escritura.pdf", propietario: "Ana Torres" },
  ]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState(null);

  const { data: propiedades, loading, loadMore, hasMore } = usePagination("/properties");

  const toggleFeatured = async (id, currentValue) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/properties/${id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ featured: !currentValue }),
      });
      const update = await res.json();
      propiedades.forEach((p, idx) => { if (p.id === id) propiedades[idx].featured = update.property.featured; });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/users", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUsuarios(data);
      } catch (err) { setErrorUsuarios(err.message); }
      finally { setLoadingUsuarios(false); }
    };
    fetchUsuarios();
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
            {loadingUsuarios ? <p>Cargando usuarios...</p> : errorUsuarios ? <p className="text-danger">{errorUsuarios}</p> : (
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
                  {usuarios.map(u => (
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
                  <th>Destacada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {propiedades.map(p => (
                  <tr key={p.id}>
                    <td>{p.location}</td>
                    <td>{p.owner?.correo || "N/A"}</td>
                    <td>{p.avaiable ? "Si" : "No"}</td>
                    <td>
                      <Button size="sm" variant={p.featured ? "success" : "secondary"} onClick={() => toggleFeatured(p.id, p.featured)}>
                        {p.featured ? "Quitar" : "Destacar"}
                      </Button>
                    </td>
                    <td>
                      <Button size="sm" variant="info" className="me-2">Ver</Button>
                      <Button size="sm" variant="danger">Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {hasMore && (
              <div className="text-center my-3">
                <Button variant="secondary" onClick={loadMore} disabled={loading}>
                  {loading ? <><Spinner animation="border" size="sm" className="me-2" />Cargando...</> : "Cargar más"}
                </Button>
              </div>
            )}
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
                {pendientes.map(p => (
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
