import React from "react";
import { Navbar, Container, Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import usePagination from "../../../hooks/usePagination.jsx";

export default function OwnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const { data: propiedades, loading, loadMore, hasMore } = usePagination(`/properties/owner/${user.id}`);

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
        <Container fluid>
          <Navbar.Brand>AlquilAR</Navbar.Brand>
          <div className="d-flex align-items-center text-white">
            <span className="me-2">{user?.name} ({user?.role})</span>
            <div className="rounded-circle bg-light" style={{ width: "30px", height: "30px" }}></div>
          </div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h3>Bienvenido/a {user?.name},</h3>
        <p className="text-muted">Estas son tus propiedades publicadas:</p>

        {loading && propiedades.length === 0 ? (
          <p>Cargando propiedades...</p>
        ) : propiedades.length === 0 ? (
          <p>No tienes propiedades registradas todavía.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Ubicación</th>
                <th>Ambientes</th>
                <th>Baños</th>
                <th>Alquiler</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propiedades.map((p) => (
                <tr key={p.id}>
                  <td>{p.ubicacion}</td>
                  <td>{p.ambientes}</td>
                  <td>{p.banos}</td>
                  <td>{p.alquiler}</td>
                  <td>{p.disponible ? "Sí" : "No"}</td>
                  <td>
                    <Button size="sm" variant="info" className="me-2">Editar</Button>
                    <Button size="sm" variant="danger">Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {hasMore && (
          <div className="text-center my-3">
            <Button variant="secondary" onClick={loadMore} disabled={loading}>
              {loading ? <><Spinner animation="border" size="sm" className="me-2" />Cargando...</> : "Cargar más"}
            </Button>
          </div>
        )}

        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate("/propiedad/create")}>
            + Agregar nueva propiedad
          </Button>
        </div>
      </Container>
    </div>
  );
}
