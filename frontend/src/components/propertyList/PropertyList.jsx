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
import Filters from "../filters/filters.jsx";
import { PostService } from "../../services/PostService.js";

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
    rentType: ""
  });
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [gridView, setGridView] = useState(false);
  const { user } = useContext(AuthenticationContext) || {};

  // 🔹 Carga inicial (sin filtros)
  const loadAllPosts = async () => {
    setLoading(true);
    try {
      const data = await PostServices.getAllPosts(token);
      const safeData = Array.isArray(data) ? data : [];
      setPosts(safeData);
      setFilteredPosts(safeData);
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      toastError("Error al obtener publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Búsqueda desde SearchBar (con filtros)
  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const allPosts = await PostService.getAllPosts(token);
      let filtered = [...allPosts];

      if (searchQuery.query) {
        const query = searchQuery.query.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.description?.toLowerCase().includes(query) ||
            post.Property?.address?.toLowerCase().includes(query)
        );
      }
      setPosts(filtered);
      applyPropertyFilters(filtersA, filtered);
    } catch (error) {
      console.error("Error al buscar publicaciones:", error);
      toastError("Error al buscar publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  const applyPropertyFilters = (filters, postsToFilter) => {
    let filtered = [...postsToFilter];

    if (filters.rooms) {
      const isPlus = filters.rooms.includes("+");
      const min = Number(filters.rooms.replace("+", ""));
      filtered = filtered.filter((post) => {
        const val = post.Property?.PropertyDetail?.numRooms || 0;
        return isPlus ? val >= min : val === min;
      });
    }

    if (filters.bedrooms) {
      const isPlus = filters.bedrooms.includes("+");
      const min = Number(filters.bedrooms.replace("+", ""));
      filtered = filtered.filter((post) => {
        const val = post.Property?.PropertyDetail?.numBedrooms || 0;
        return isPlus ? val >= min : val === min;
      });
    }

    if (filters.bathrooms) {
      const value = filters.bathrooms;
      filtered = filtered.filter((post) => {
        const baths = post.Property?.PropertyDetail?.numBathrooms || 0;
        if (value.endsWith("+")) {
          const min = Number(value.replace("+", ""));
          return baths >= min;
        }
        return baths === Number(value);
      });
    }

    if (filters.totalArea) {
      const value = filters.totalArea;
      filtered = filtered.filter((post) => {
        const area = post.Property?.PropertyDetail?.totalArea || 0;
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

    if (filters.age) {
      const value = filters.age;
      filtered = filtered.filter((post) => {
        const age = post.Property?.PropertyDetail?.propertyAge || 0;
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

    if (filters.minPrice) {
      filtered = filtered.filter(
        (post) => post.Property?.rentPrice >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (post) => post.Property?.rentPrice <= Number(filters.maxPrice)
      );
    }

    setFilteredPosts(filtered);
  };


  //filtro para la searchbar desde el front
  const handleFilterChange = (newFilters) => {
    setFiltersA(newFilters);
    applyPropertyFilters(newFilters, posts);
  };

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
    loadAllPosts(); // ✅ solo al montar
    if (user) loadFavorites();
  }, [user, token]);

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
      <h2 className="fw-bold mb-4 text-center">Publicaciones disponibles</h2>

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
      ) : Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
        <Row className={gridView ? "g-4" : "justify-content-center g-3 px-3"}>
          {filteredPosts.map((post) => (
            <Col key={post.id} md={gridView ? 4 : 12}>
              {gridView ? (
                <PropertyCard property={post.Property} post={post} />
              ) : (
                <Card className="shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
                  <Row className="g-0">
                    <Col md={4}>
                      <Card.Img
                        src={post.Property?.image}
                        alt={post.titulo}
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
                        <Card.Title>{post.titulo}</Card.Title>
                        <Card.Text>
                          <strong>Dirección:</strong> {post.Property?.address} <br />
                          <strong>Precio:</strong> ${post.Property?.rentPrice} <br />
                          <strong>Habitaciones:</strong>{post.PropertyDetail?.numBedrooms || "-"} <br />
                          <strong>Estado:</strong> {post.status}
                        </Card.Text>

                        <button
                          className="position-absolute top-0 end-0 m-2"
                          style={{ background: "transparent", border: "none" }}
                          onClick={() => handleFavoriteClick(post.Property?.idProperty)}
                        >
                          <FontAwesomeIcon
                            icon={
                              favorites.includes(post.Property?.idProperty)
                                ? faHeart
                                : faHeartRegular
                            }
                            style={{ color: "red" }}
                            size="lg"
                          />
                        </button>

                        <Button
                          as={Link}
                          to={`/posts/${post.id}`}
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
