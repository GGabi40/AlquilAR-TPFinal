import { useEffect, useState, useContext } from "react";
import ConfirmModal from "../ui/modal/ConfirmModal.jsx";
import { favoriteService } from "../../services/favoriteService.js";
import { AuthenticationContext } from "../../services/auth.context.jsx";
import { toastError, toastSuccess } from "../ui/toaster/Notifications";
import { Container, Row, Col, Spinner, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router";
import SearchBar from "../search/SearchBar";
import PropertyCard from "../propertyCard/PropertyCard";
import { PostService } from "../../services/PostService";
import Filters from "../filters/filters.jsx";

const PropertyList = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filtersA, setFiltersA] = useState({
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    totalArea: "",
    age: "",
    minPrice: "",
    maxPrice: "",
    rentType: "",
  });
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [gridView, setGridView] = useState(false);

  const { user } = useContext(AuthenticationContext) || {};

  // Carga inicial — traer POSTS completos
  const loadAllPosts = async () => {
    setLoading(true);
    try {
      const data = await PostService.getAllPosts();
      const safe = Array.isArray(data) ? data : [];

      // Filtrar solo posts con propiedad
      const valid = safe.filter(
        (post) => post.property && post.status === "active"
      );

      setPosts(valid);
      setFilteredPosts(valid);
    } catch (err) {
      console.error(err);
      toastError("Error al obtener publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  // Buscador (searchbar)
  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const data = await PostService.searchPosts(filters);
      const safe = Array.isArray(data) ? data : [];

      const valid = safe.filter((post) => post.property);
      setPosts(valid);
      setFilteredPosts(valid);
    } catch (err) {
      console.error(err);
      toastError("Error al realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // Filtros del frontend (rooms, etc.)
  const handleFilterChange = (newFilters) => {
    setFiltersA(newFilters);

    let filtered = [...posts];

    // Filtros basados en p.property.PropertyDetail
    const getDetail = (p) => p.property?.PropertyDetail || {};

    if (newFilters.rooms) {
      const isPlus = newFilters.rooms.includes("+");
      const min = Number(newFilters.rooms.replace("+", ""));
      filtered = filtered.filter((p) => {
        const val = getDetail(p).numRooms || 0;
        return isPlus ? val >= min : val === min;
      });
    }

    if (newFilters.bedrooms) {
      const isPlus = newFilters.bedrooms.includes("+");
      const min = Number(newFilters.bedrooms.replace("+", ""));
      filtered = filtered.filter((p) => {
        const val = getDetail(p).numBedrooms || 0;
        return isPlus ? val >= min : val === min;
      });
    }

    if (newFilters.bathrooms) {
      const value = newFilters.bathrooms;
      filtered = filtered.filter((p) => {
        const baths = getDetail(p).numBathrooms || 0;

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
        const area = getDetail(p).totalArea || 0;

        if (value.includes("-")) {
          const [min, max] = value.split("-").map(Number);
          return area >= min && area <= max;
        }

        if (value.endsWith("+")) {
          return area >= Number(value.replace("+", ""));
        }

        return true;
      });
    }

    if (newFilters.minPrice) {
      filtered = filtered.filter(
        (p) => p.property?.rentPrice >= Number(newFilters.minPrice)
      );
    }

    if (newFilters.maxPrice) {
      filtered = filtered.filter(
        (p) => p.property?.rentPrice <= Number(newFilters.maxPrice)
      );
    }

    setFilteredPosts(filtered);
  };

  // 🔹 Favoritos
  const loadFavorites = async () => {
    try {
      const res = await favoriteService.getFavorites();
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toastError("Error cargando favoritos");
    }
  };

  // 🔹 Efecto inicial
  useEffect(() => {
    loadAllPosts();
    if (user) loadFavorites();
  }, [user]);

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
      console.error(err);
    }
  };

  // 🔹 Render
  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-4 text-center">Propiedades disponibles</h2>

      <SearchBar onSearch={handleSearch} />

      <div className="d-flex justify-content-center mb-3 flex-wrap">
        <Filters onFilterChange={handleFilterChange} />
      </div>

      <div className="d-flex justify-content-center mb-4">
        <Button
          variant="outline-secondary"
          onClick={() => setGridView(!gridView)}
        >
          {gridView ? "Vista Lista" : "Vista Cuadrícula"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : filteredPosts.length > 0 ? (
        <Row className={gridView ? "g-4" : "justify-content-center g-3 px-3"}>
          {filteredPosts.map((post) => {
            const property = post.property;
            const detail = property?.PropertyDetail;

            const image =
              detail?.PropertyImages?.[0]?.URLImages || "/photos/no-image.png";

            return (
              <Col key={post.id} md={gridView ? 4 : 12}>
                {gridView ? (
                  <PropertyCard post={post} />
                ) : (
                  <Card
                    className="shadow-sm mx-auto"
                    style={{ maxWidth: "800px" }}
                  >
                    <Row className="g-0">
                      <Col md={4}>
                        <Card.Img
                          src={image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Col>

                      <Col md={8} className="p-2 d-flex flex-column">
                        <Card.Body className="position-relative">
                          <Card.Title>{post.title}</Card.Title>

                          <Card.Text>
                            <strong>Dirección:</strong> {property.address}{" "}
                            <br />
                            <strong>Precio:</strong> ${property.rentPrice}{" "}
                            <br />
                            <strong>Habitaciones:</strong>{" "}
                            {detail?.numBedrooms || "-"}
                          </Card.Text>

                          <button
                            className="position-absolute top-0 end-0 m-2"
                            style={{
                              background: "transparent",
                              border: "none",
                            }}
                            onClick={() =>
                              handleFavoriteClick(property.idProperty)
                            }
                          >
                            <FontAwesomeIcon
                              icon={
                                favorites.includes(property.idProperty)
                                  ? faHeart
                                  : faHeartRegular
                              }
                              style={{ color: "red" }}
                              size="lg"
                            />
                          </button>

                          <Button
                            as={Link}
                            to={`/properties/${property.idProperty}`}
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
            );
          })}
        </Row>
      ) : (
        <p className="text-center text-muted">No se encontraron propiedades.</p>
      )}

      <ConfirmModal
        show={showConfirm}
        title="Eliminar de favoritos"
        message="¿Querés quitar esta propiedad de tus favoritos?"
        onConfirm={() => setShowConfirm(false)}
        onClose={() => setShowConfirm(false)}
      />
    </Container>
  );
};

export default PropertyList;
