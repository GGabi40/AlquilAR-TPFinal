import { useEffect, useState } from "react";
import ConfirmModal from "../ui/modal/ConfirmModal.jsx";
import { favoriteService } from "../../services/favoriteService.js";
import { useContext } from "react";
import { AuthenticationContext } from "../../services/auth.context.jsx";
import { toastError, toastSuccess } from "../ui/toaster/Notifications";
import {
  Container,
  Row,
  Col,
  Spinner,
  Dropdown,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faHeart, faL } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router";
import SearchBar from "../search/SearchBar";
import PropertyCard from "../propertyCard/PropertyCard";
import PropertyServices from "../../services/propertyServices";

const PropertyList = ({ token }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tipo, setTipo] = useState("");
  const [habitaciones, setHabitaciones] = useState("");
  const [ambientes, setAmbientes] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [search, setSearch] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [gridView, setGridView] = useState(false);

  const { user } = useContext(AuthenticationContext) || {};

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const data = Object.keys(filters).length
        ? await PropertyServices.searchProperties(filters)
        : await PropertyServices.getAllProperties();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      toastError("Error al obtener propiedades:", error);
    } finally {
      setLoading(false);
    }
  };

    const loadFavorites = async () => {
      try {
        const res = await favoriteService.getFavorites();
        const favorites = Array.isArray(res.data) ? res.data : [];
        setFavorites(favorites);
      } catch (error) {
        toastError("Error cargando favoritos:", error);
      }
    };

  useEffect(() => {
    fetchProperties();
    if (user) fetchFavorites();
  }, [user]);

  const handleApplyFilters = () => {
    const results = properties.filter((p) => {
      return (
        (tipo === "" || p.tipo === tipo) &&
        (habitaciones === "" || p.hab === parseInt(habitaciones)) &&
        (ambientes === "" || p.hab === parseInt(ambientes)) &&
        (precioMin === "" || p.precio >= parseInt(precioMin)) &&
        (precioMax === "" || p.precio <= parseInt(precioMax)) &&
        (provincia === "" ||
          p.provincia.toLowerCase().includes(provincia.toLowerCase())) &&
        (localidad === "" ||
          p.localidad.toLowerCase().includes(localidad.toLowerCase())) &&
        (search === "" || p.titulo.toLowerCase().includes(search.toLowerCase()))
      );
    });
    setFilteredProperties(results);
  };

  const handleFavoriteClick = async (propertyId) => {
    try {
      if (favorites.includes(propertyId)) {
        await favoriteService.removeFavorite(propertyId, token);
        setFavorites(prev => prev.filter(fav => fav !== propertyId));
      } else {
        await favoriteService.addFavorite(propertyId, token);
        setFavorites(prev => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
    }
  };

  const handleRemoveClick = (propertyId) => {
    setSelectedProperty(propertyId);
    setShowConfirm(true);
  };

  const handleConfirmRemove = async () => {
    try {
      const res = await favoriteService.removeFavorite(selectedProperty, user.token);
      if (res.success) {
        setFavorites((prev) => prev.filter((id) => id !== selectedProperty));
        toastSuccess("Propiedad eliminada de favoritos");
      } else {
        toastError(res.message);
      }
    } catch {
      toastError("No se pudo eliminar de favoritos.");
    } finally {
      setShowConfirm(false);
    }
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
              onChange={() =>
                setTipo(tipo === "Departamento" ? "" : "Departamento")
              }
            />
            <Form.Check
              type="checkbox"
              label="Casas"
              checked={tipo === "Casa"}
              onChange={() => setTipo(tipo === "Casa" ? "" : "Casa")}
            />

            <Form.Select
              className="mt-2"
              value={habitaciones}
              onChange={(e) => setHabitaciones(e.target.value)}
            >
              <option value="">Habitaciones</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              className="mt-2"
              value={ambientes}
              onChange={(e) => setAmbientes(e.target.value)}
            >
              <option value="">Ambientes</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
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

            <Button
              variant="success"
              className="mt-3 w-100"
              onClick={handleApplyFilters}
            >
              <FontAwesomeIcon icon={faFilter} className="me-2" /> Aplicar
              Filtros
            </Button>
          </Dropdown.Menu>
        </Dropdown>

        <Button
          variant="outline-secondary"
          className="ms-2 mt-2 mt-sm-0"
          onClick={() => setGridView(!gridView)}
        >
          {gridView ? "Vista Lista" : "Vista Cuadrícula"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : filteredProperties.length === 0 ? (
        <p className="text-center text-muted">No se encontraron propiedades.</p>
      ) : (
        <Row className={gridView ? "g-4" : "justify-content-center g-3 px-3"}>
          {(filteredProperties.length > 0
            ? filteredProperties
            : properties
          ).map((p) => (
            <Col key={p.propertyId || p.id || Math.random()} md={gridView ? 4 : 12}>
              {gridView ? (
                <PropertyCard property={p} />
              ) : (
                <Card
                  className="shadow-sm mx-auto"
                  style={{ maxWidth: "800px" }}
                >
                  <Row className="g-0">
                    <Col md={4}>
                      <Card.Img
                        src={p.image}
                        alt={p.titulo}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                    <Col
                      md={8}
                      className="d-flex flex-column justify-content-between p-2"
                    >
                      <Card.Body className="position-relative">
                        <Card.Title>{p.titulo}</Card.Title>
                        <Card.Text>
                          <strong>Dirección:</strong> {p.address} <br />
                          <strong>Precio:</strong> ${p.rentPrice} <br />
                          <strong>Habitaciones:</strong> {""}
                          {p.PropertyDetail.numBedrooms}
                        </Card.Text>
                        <div className="position-relative">
                          <button
                            className="position-absolute top-0 end-0 m-2"
                            style={{ background: "transparent", border: "none" }}
                            onClick={() => handleFavoriteClick(p.propertyId)}
                          >
                            <FontAwesomeIcon
                              icon={favorites.includes(p.propertyId) ? faHeart : faHeartRegular}
                              style={{ color: "red" }}
                              size="lg"
                            />
                          </button>
                        </div>

                        <Button
                          as={Link}
                          to={`/property/${p.propertyId}`}
                          variant="primary"
                        >
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
      )}

      <ConfirmModal
        show={showConfirm}
        title="Eliminar de favoritos"
        message="¿Estás segura/o de que querés quitar esta propiedad de tus favoritos?"
        onConfirm={handleConfirmRemove}
        onClose={() => setShowConfirm(false)}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </Container>
  );
};

export default PropertyList;
