import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMapMarkerAlt,
  faMoneyBillWave,
  faRulerCombined,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

import PropertyServices from "../../../services/propertyServices";
import Notifications, { toastError, toastSuccess } from "../../ui/toaster/Notifications";
import { AuthenticationContext } from "../../../services/auth.context";

export default function PropertyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthenticationContext);

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);

  const [form, setForm] = useState({
    propertyType: "",
    rentPrice: "",
    expensesPrice: "",
    address: "",
    rentPreference: "",
    numRooms: "",
    numBedrooms: "",
    numBathrooms: "",
    propertyAge: "",
    totalArea: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await PropertyServices.getPropertyById(id);
        setProperty(data);

        const details = data.PropertyDetail || {};

        setForm({
          propertyType: data.propertyType,
          rentPrice: data.rentPrice,
          expensesPrice: data.expensesPrice ?? "",
          address: data.address,
          rentPreference: data.rentPreference,
          numRooms: details.numRooms ?? "",
          numBedrooms: details.numBedrooms ?? "",
          numBathrooms: details.numBathrooms ?? "",
          propertyAge: details.propertyAge ?? "",
          totalArea: details.totalArea ?? "",
        });
      } catch (err) {
        toastError("Error al traer la propiedad");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await PropertyServices.updateProperty(id, form, token);
      toastSuccess("Propiedad actualizada correctamente");

      setTimeout(() => {
        navigate("/owner/dashboard");
      }, 1500);

    } catch (error) {
      toastError("Error al actualizar la propiedad");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando propiedad...</p>
      </div>
    );

  const details = property?.PropertyDetail;

  return (
    <Container className="mt-5" style={{ maxWidth: "900px" }}>
      <Notifications />

      {/* ENCABEZADO */}
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle shadow-sm"
          style={{
            width: "90px",
            height: "90px",
            background: "#ffffff",
          }}
        >
          <FontAwesomeIcon icon={faHome} className="dashboard-fa-icon" />
        </div>
        <h2 className="fw-bold mt-3">Editar Propiedad</h2>
        <p className="text-muted">Actualizá los datos reales de tu inmueble.</p>
      </div>

      <Card className="shadow-sm p-4 border-0 rounded-4">
        <Form onSubmit={handleSubmit}>
          <h5 className="fw-semibold mb-3">Datos generales</h5>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Tipo de Propiedad</Form.Label>
                <Form.Select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                >
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Precio Alquiler</Form.Label>
                <Form.Control
                  type="number"
                  name="rentPrice"
                  value={form.rentPrice}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Expensas</Form.Label>
                <Form.Control
                  type="number"
                  name="expensesPrice"
                  value={form.expensesPrice}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>
            </Col>

            {/* CARACTERÍSTICAS */}
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>Ambientes</Form.Label>
                <Form.Control
                  type="number"
                  name="numRooms"
                  value={form.numRooms}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Dormitorios</Form.Label>
                <Form.Control
                  type="number"
                  name="numBedrooms"
                  value={form.numBedrooms}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Baños</Form.Label>
                <Form.Control
                  type="number"
                  name="numBathrooms"
                  value={form.numBathrooms}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Superficie Total (m²)</Form.Label>
                <Form.Control
                  type="number"
                  name="totalArea"
                  value={form.totalArea}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Antigüedad (años)</Form.Label>
                <Form.Control
                  type="number"
                  name="propertyAge"
                  value={form.propertyAge}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button type="submit" variant="success" className="px-4 py-2 rounded-3">
              Guardar cambios
            </Button>

            <Button
              variant="outline-danger"
              className="px-4 py-2 rounded-3"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
