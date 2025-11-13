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
import Filters from "../filters/Filters.jsx";

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
  const [noResults, setNoResults] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [gridView, setGridView] = useState(false);

  const { user } = useContext(AuthenticationContext) || {};

  // Carga inicial — traer POSTS completos
  const loadAllPosts = async () => {
    setLoading(true);
    try {
      const data = await PostService.getAllPosts();
      const safe = Array.isArray(data) ? data : [];

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
  const handleSearch = ({ q }) => {
    const query = q?.toLowerCase().trim();

    if (!query) {
      setFilteredPosts(posts);
      return;
    }

    const results = posts.filter((p) => {
      const prop = p.property || {};

      const matches =
        p.title?.toLowerCase().includes(query) ||
        prop.address?.toLowerCase().includes(query) ||
        prop.propertyType?.toLowerCase().includes(query) ||
        prop.locality?.name?.toLowerCase().includes(query) ||
        prop.province?.name?.toLowerCase().includes(query);

      return matches && p.status === "active";
    });

    // Si no hay resultados → mostrar todos pero marcar estado especial
    if (results.length === 0) {
      setFilteredPosts([]);
      setNoResults(query);
    } else {
      setFilteredPosts(results);
      setNoResults(null);
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

    if (newFilters.age) {
      const value = newFilters.age;

      filtered = filtered.filter((p) => {
        const age = getDetail(p).propertyAge || 0;

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

  // Favoritos
  const loadFavorites = async () => {
    try {
      const res = await favoriteService.getFavorites();
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toastError("Error cargando favoritos");
    }
  };

  // Efecto inicial
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

  // Render
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
      ) : noResults ? (
        <>
          <p className="text-center text-muted fs-5">
            No encontramos resultados para: <strong>"{noResults}"</strong>
          </p>
          <p className="text-center text-muted mb-4">
            Pero tenemos estas propiedades disponibles:
          </p>

          <Row className={gridView ? "g-4" : "justify-content-center g-3 px-3"}>
            {posts.map((post) => (
              <Col key={post.id} md={gridView ? 4 : 12}>
                <PropertyCard post={post} view={gridView ? "grid" : "list"} />
              </Col>
            ))}
          </Row>
        </>
      ) : filteredPosts.length > 0 ? (
        <Row className={gridView ? "g-4" : "justify-content-center g-3 px-3"}>
          {filteredPosts.map((post) => (
            <Col key={post.id} md={gridView ? 4 : 12}>
              <PropertyCard post={post} view={gridView ? "grid" : "list"} />
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
        onConfirm={() => setShowConfirm(false)}
        onClose={() => setShowConfirm(false)}
      />
    </Container>
  );
};

export default PropertyList;
