import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Dropdown, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import SearchBar from "../search/SearchBar";
import PropertyCard from "../propertyCard/PropertyCard";
import PropertyServices from "../../services/propertyServices";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tipo, setTipo] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [provincia, setProvincia] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [search, setSearch] = useState("");

  const [gridView, setGridView] = useState(false);

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const data = Object.keys(filters).length
        ? await PropertyServices.searchProperties(filters)
        : await PropertyServices.getAllProperties();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error("Error al obtener propiedades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApplyFilters = () => {
    const results = properties.filter((p) => {
      return (
        (tipo === '' || p.tipo === tipo) &&
        (habitaciones === '' || p.hab === parseInt(habitaciones)) &&
        (ambientes === '' || p.hab === parseInt(ambientes)) &&
        (precioMin === '' || p.precio >= parseInt(precioMin)) &&
        (precioMax === '' || p.precio <= parseInt(precioMax)) &&
        (provincia === '' || p.provincia.toLowerCase().includes(provincia.toLowerCase())) &&
        (localidad === '' || p.localidad.toLowerCase().includes(localidad.toLowerCase())) &&
        (search === '' || p.titulo.toLowerCase().includes(search.toLowerCase()))
      );
    });
    setFilteredProperties(results);
  };

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-4 text-center">Propiedades disponibles</h2>

      <SearchBar
        onSearch={(filters) => fetchProperties(filters)}
        onTextChange={(value) => setSearch(value)}
      />

      <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap">
        <Dropdown className="ms-2">
          <Dropdown.Toggle variant="outline-primary">
            <FontAwesomeIcon icon={faFilter} /> Filtros
          </Dropdown.Toggle>

          <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>
            <Form.Check
              type="checkbox"
              label="Departamentos"
              checked={tipo === "Departamento"}
              onChange={() => setTipo(tipo === "Departamento" ? "" : "Departamento")}
            />
            <Form.Check
              type="checkbox"
              label="Casas"
              checked={tipo === "Casa"}
              onChange={() => setTipo(tipo === "Casa" ? "" : "Casa")}
            />

            <Form.Select className="mt-2" value={habitaciones} onChange={(e) => setHabitaciones(e.target.value)}>
              <option value="">Habitaciones</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Form.Select>

            <Form.Select className="mt-2" value={ambientes} onChange={(e) => setAmbientes(e.target.value)}>
              <option value="">Ambientes</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Form.Select>

            <Form.Control
              className="mt-2"
              type="number"
              placeholder="Precio min"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
            />

            <Form.Control
              className="mt-2"
              type="number"
              placeholder="Precio max"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />

            <Form.Control
              className="mt-2"
              type="text"
              placeholder="Localidad"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
            />

            <Form.Control
              className="mt-2"
              type="text"
              placeholder="Provincia"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
            />

            <Button variant="success" className="mt-3 w-100" onClick={handleApplyFilters}>
              <FontAwesomeIcon icon={faFilter} className="me-2" /> Aplicar Filtros
            </Button>
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="outline-secondary" className="ms-2 mt-2 mt-sm-0" onClick={() => setGridView(!gridView)}>
          {gridView ? "Vista Lista" : "Vista Cuadrícula"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (filteredProperties.length === 0 ? (
        <p className="text-center text-muted">No se encontraron propiedades.</p>
      ) : (
        <Row className={gridView ? "g-4" : "justify-content-center g-3 px-3"}>
          {(filteredProperties.length > 0 ? filteredProperties : properties).map((p) => (
            <Col key={p.idProperty} md={gridView ? 4 : 12}>
              {gridView ? (
                <PropertyCard property={p} />
              ) : (
                <Card className="shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
                  <Row className="g-0">
                    <Col md={4}>
                      <Card.Img
                        src={p.img}
                        alt={p.titulo}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Col>
                    <Col md={8} className="d-flex flex-column justify-content-between p-2">
                      <Card.Body>
                        <Card.Title>{p.titulo}</Card.Title>
                        <Card.Text>
                          <strong>Dirección:</strong> {p.direccion} <br />
                          <strong>Precio:</strong> ${p.precio} <br />
                          <strong>Habitaciones:</strong> {p.hab}
                        </Card.Text>
                        <Button as={Link} to={`/property/${p.idProperty}`} variant="primary">
                          + Información
                        </Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              )}
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default PropertyList;
