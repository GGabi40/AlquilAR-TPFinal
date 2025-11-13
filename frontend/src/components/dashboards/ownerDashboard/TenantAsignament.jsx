import React, { useState, useContext } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Notifications, { toastError, toastSuccess } from "../../ui/toaster/Notifications";
import { PostService } from "../../../services/PostService";
import { searchUsers } from '../../../services/userService';
import { AuthenticationContext } from "../../../services/auth.context";
import { useParams } from "react-router";

const TenantAssignment = () => {
  const { id: postId } = useParams(); // ID del post desde la URL
  const { token } = useContext(AuthenticationContext);

  // búsqueda de usuarios
  const [tenantQuery, setTenantQuery] = useState("");
  const [tenantResults, setTenantResults] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // datos del alquiler
  const [rentalForm, setRentalForm] = useState({
    startDate: "",
    endDate: "",
  });

  const handleRentalInput = (e) => {
    setRentalForm({
      ...rentalForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleTenantSearch = async (e) => {
    const q = e.target.value;
    setTenantQuery(q);

    if (q.trim().length < 2) {
      setTenantResults([]);
      return;
    }

    try {
      const results = await searchUsers(q, token);
      setTenantResults(results);
    } catch (err) {
      console.error(err);
      toastError("No se pudo buscar usuarios");
    }
  };

  const selectTenant = (user) => {
    setSelectedTenant(user);
    setTenantQuery(`${user.name} ${user.surname}`);
    setTenantResults([]);
  };

  const handleCreateRental = async () => {
    if (!selectedTenant) return toastError("Seleccioná un usuario");

    const payload = {
      postId,
      tenantId: selectedTenant.id,
      startDate: rentalForm.startDate,
      endDate: rentalForm.endDate,
      totalPrice: rentalForm.totalPrice,
    };

    try {
      await PostService.createRental(payload, token);
      toastSuccess("Alquiler creado correctamente 🎉");
    } catch (err) {
      console.error(err);
      toastError("No se pudo crear el alquiler");
    }
  };

  return (
    <div className="mt-4">
      <Notifications />

      <p className="text-muted">
        Aquí podés vincular esta propiedad con un usuario para iniciar un alquiler.
      </p>

      <Row className="g-3">
        {/* Usuario */}
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-semibold">Inquilino</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por email o nombre..."
              value={tenantQuery}
              onChange={handleTenantSearch}
              className="rounded-3 shadow-sm"
            />

            {/* Lista de resultados */}
            {tenantResults.length > 0 && (
              <div
                className="border rounded-3 shadow-sm p-2 mt-1"
                style={{ maxHeight: "180px", overflowY: "auto" }}
              >
                {tenantResults.map((u) => (
                  <div
                    key={u.id}
                    className="p-2 hover-bg-light rounded-3 tenant-select-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => selectTenant(u)}
                  >
                    {u.name} {u.surname} – {u.email}
                  </div>
                ))}
              </div>
            )}

            {selectedTenant && (
              <div className="mt-2 text-success fw-semibold">
                ✔ Inquilino seleccionado: {selectedTenant.name} {selectedTenant.surname}
              </div>
            )}
          </Form.Group>
        </Col>

        {/* Fechas */}
        <Col md={3}>
          <Form.Group>
            <Form.Label className="fw-semibold">Fecha inicio</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={rentalForm.startDate}
              onChange={handleRentalInput}
              className="rounded-3 shadow-sm"
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label className="fw-semibold">Fecha final</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={rentalForm.endDate}
              onChange={handleRentalInput}
              className="rounded-3 shadow-sm"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="mt-4">
        <Button
          variant="primary"
          className="px-4 py-2 rounded-3"
          onClick={handleCreateRental}
          disabled={!selectedTenant}
        >
          Confirmar Alquiler
        </Button>
      </div>
    </div>
  );
};

export default TenantAssignment;
