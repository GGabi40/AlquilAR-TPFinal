import { useEffect, useState, useContext } from "react";
import ConfirmModal from "../ui/modal/ConfirmModal.jsx";
import { favoriteService } from "../../services/favoriteService.js";
import { AuthenticationContext } from "../../services/auth.context.jsx";
import { toastError, toastSuccess } from "../ui/toaster/Notifications";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router";
import SearchBar from "../search/SearchBar";
import PropertyCard from "../propertyCard/PropertyCard";
import PropertyServices from "../../services/propertyServices";
import Filters from "../filters/filters.jsx";

const PropertyList = ({ token }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filtersA, setFiltersA] = useState({
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    totalArea: "",
    age: "",
    minPrice: "",
    maxPrice: "",
    rentType: ""
  });
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [gridView, setGridView] = useState(false);

  const { user } = useContext(AuthenticationContext) || {};

  // 🔹 Carga inicial (sin filtros)
  const loadAllProperties = async () => {
    setLoading(true);
    try {
      const data = await PropertyServices.getAllProperties();
      const safeData = Array.isArray(data) ? data : [];
      setProperties(safeData);
      setFilteredProperties(safeData);
    } catch (error) {
      console.error("Error al obtener propiedades:", error);
      toastError("Error al obtener propiedades.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Búsqueda desde SearchBar (con filtros)
  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const data = await PropertyServices.searchProperties(filters);
      const safeData = Array.isArray(data) ? data : [];
      setProperties(safeData);
      setFilteredProperties(safeData);
    } catch (error) {
      console.error("Error al buscar propiedades:", error);
      toastError("Error al buscar propiedades.");
    } finally {
      setLoading(false);
    }
  };

  //filtro para la searchbar desde el front
  const handleFilterChange = (newFilters) => {
    setFiltersA(newFilters);

    let filtered = [...properties];

    if (newFilters.rooms) {
      const isPlus = newFilters.rooms.includes("+");
      const min = Number(newFilters.rooms.replace("+", ""));
      filtered = filtered.filter((p) => {
        const val = p.PropertyDetail?.numRooms || 0;
        return isPlus ? val >= min : val === min;
      });
    }

    if (newFilters.bedrooms) {
      const isPlus = newFilters.bedrooms.includes("+");
      const min = Number(newFilters.bedrooms.replace("+", ""));
      filtered = filtered.filter((p) => {
        const val = p.PropertyDetail?.numBedrooms || 0;
        return isPlus ? val >= min : val === min;
      });
    }

    if (newFilters.bathrooms) {
      const value = newFilters.bathrooms;
      filtered = filtered.filter((p) => {
        const baths = p.PropertyDetail?.numBathrooms || 0;

        if (value.endsWith("+")) {
          const min = Number(value.replace("+", ""));
          return baths >= min;
        }

        return baths === Number(value);
      });
    }

    if (newFilters.totalArea) {
      const value = newFilters.totalArea;

      filtered = filtered.filter((p) => {
        const area = p.PropertyDetail?.totalArea || 0;

        if (value.includes("-")) {
          const [min, max] = value.split("-").map(Number);
          return area >= min && area <= max;
        }

        if (value.endsWith("+")) {
          const min = Number(value.replace("+", ""));
          return area >= min;
        }

        return true;
      });
    }


    if (newFilters.age) {
      const value = newFilters.age;

      filtered = filtered.filter((p) => {
        const age = p.PropertyDetail?.propertyAge || 0;

        if (value.includes("-")) {
          const [min, max] = value.split("-").map(Number);
          return age >= min && age <= max;
        }

        if (value.endsWith("+")) {
          const min = Number(value.replace("+", ""));
          return age >= min;
        }

        return true;
      });
    }

    if (newFilters.minPrice) {
      filtered = filtered.filter(
        (p) => p.rentPrice >= Number(newFilters.minPrice)
      );
    }

    if (newFilters.maxPrice) {
      filtered = filtered.filter(
        (p) => p.rentPrice <= Number(newFilters.maxPrice)
      );
    }

    setFilteredProperties(filtered);
  }

  // 🔹 Favoritos
  const loadFavorites = async () => {
    try {
      const res = await favoriteService.getFavorites();
      const favorites = Array.isArray(res.data) ? res.data : [];
      setFavorites(favorites);
    } catch (error) {
      toastError("Error cargando favoritos.");
    }
  };

  // 🔹 Carga inicial al montar el componente
  useEffect(() => {
    loadAllProperties(); // ✅ solo al montar
    if (user) loadFavorites();
  }, [user]);

  // 🔹 Manejo de favoritos
  const handleFavoriteClick = async (propertyId) => {
    try {
      if (favorites.includes(propertyId)) {
        await favoriteService.removeFavorite(propertyId, token);
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await favoriteService.addFavorite(propertyId, token);
        setFavorites((prev) => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
    }
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

  // 🔹 Render principal
  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-4 text-center">Propiedades disponibles</h2>

      {/* 🔍 SearchBar con la búsqueda por backend */}
      <SearchBar onSearch={handleSearch} />

      {/* 🎛️ Botón de filtros (independiente del search) */}
      <div className="d-flex justify-content-center align-items-center mb-3 flex-wrap">
        <Filters onFilterChange={handleFilterChange} />
      </div>

      <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap">
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
      ) : Array.isArray(filteredProperties) && filteredProperties.length > 0 ? (
        <Row className={gridView ? "g-4" : "justify-content-center g-3 px-3"}>
          {filteredProperties.map((p) => (
            <Col key={p.propertyId || p.id || Math.random()} md={gridView ? 4 : 12}>
              {gridView ? (
                <PropertyCard property={p} />
              ) : (
                <Card className="shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
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
                          <strong>Habitaciones:</strong>{" "}
                          {p.PropertyDetail?.numBedrooms || "-"}
                        </Card.Text>

                        <button
                          className="position-absolute top-0 end-0 m-2"
                          style={{ background: "transparent", border: "none" }}
                          onClick={() => handleFavoriteClick(p.propertyId)}
                        >
                          <FontAwesomeIcon
                            icon={
                              favorites.includes(p.propertyId)
                                ? faHeart
                                : faHeartRegular
                            }
                            style={{ color: "red" }}
                            size="lg"
                          />
                        </button>

                        <Button
                          as={Link}
                          to={`/properties/${p.idProperty}`}
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
      ) : (
        <p className="text-center text-muted">No se encontraron propiedades.</p>
      )}

      <ConfirmModal
        show={showConfirm}
        title="Eliminar de favoritos"
        message="¿Querés quitar esta propiedad de tus favoritos?"
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
