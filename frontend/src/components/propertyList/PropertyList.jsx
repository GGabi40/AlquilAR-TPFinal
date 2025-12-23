import { useEffect, useState, useContext } from "react";
import ConfirmModal from "../ui/modal/ConfirmModal.jsx";
import { favoriteService } from "../../services/favoriteService.js";
import { AuthenticationContext } from "../../services/auth.context.jsx";
import { toastError, toastSuccess } from "../ui/toaster/Notifications";
import { Container, Row, Col, Spinner, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { Link, useSearchParams } from "react-router";
import SearchBar from "../search/SearchBar";
import PropertyCard from "../propertyCard/PropertyCard";
import { PostService } from "../../services/PostService";
import Filters from "../filters/Filters.jsx";

const emptyFilters = {
  rooms: "",
  bedrooms: "",
  bathrooms: "",
  totalArea: "",
  age: "",
  minPrice: "",
  maxPrice: "",
  rentType: "",
};

const hasAnyFilter = (f) =>
  Object.values(f).some((v) => String(v ?? "").trim() !== "");

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

  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get("q") || "";

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
    const clean = q?.trim() || "";

    if (!clean) {
      setSearchParams({});
    } else {
      setSearchParams({ q: clean });
    }
  };

  useEffect(() => {
    const combined = applySearchAndFilters(posts, qFromUrl, filtersA);
    setFilteredPosts(combined);

    const query = (qFromUrl || "").trim();
    const anyFilter = hasAnyFilter(filtersA);

    if ((query || anyFilter) && combined.length === 0) {
      const searchOnly = applySearchAndFilters(posts, qFromUrl, emptyFilters);

      if (query && anyFilter && searchOnly.length > 0) {
        setNoResults(
          `Hay resultados para "${query}", pero ninguno coincide con los filtros actuales.`
        );
      } else if (query) {
        setNoResults(`No encontramos resultados para "${query}".`);
      } else {
        setNoResults(
          `No encontramos resultados con los filtros seleccionados.`
        );
      }
    } else {
      setNoResults(null);
    }
  }, [posts, qFromUrl, filtersA]);

  // Filtros del frontend (rooms, etc.)
  const handleFilterChange = (newFilters) => {
    console.log("newFilters:", newFilters);
    setFiltersA(newFilters);
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

  const applySearchAndFilters = (allPosts, q, f) => {
    let filtered = [...allPosts];

    filtered = filtered.filter((p) => p.property && p.status === "active");

    // búsqueda
    const query = (q || "").toLowerCase().trim();
    if (query) {
      filtered = filtered.filter((p) => {
        const prop = p.property || {};
        return (
          p.title?.toLowerCase().includes(query) ||
          prop.address?.toLowerCase().includes(query) ||
          prop.propertyType?.toLowerCase().includes(query) ||
          prop.locality?.name?.toLowerCase().includes(query) ||
          prop.province?.name?.toLowerCase().includes(query)
        );
      });
    }

    // filtros
    const getDetail = (p) => p.property?.PropertyDetail || {};

    if (f.rooms) {
      const isPlus = f.rooms.includes("+");
      const min = Number(f.rooms.replace("+", ""));
      filtered = filtered.filter((p) => {
        const val = Number(getDetail(p).numRooms || 0);
        return isPlus ? val >= min : val === min;
      });
    }

    if (f.bedrooms) {
      const isPlus = f.bedrooms.includes("+");
      const min = Number(f.bedrooms.replace("+", ""));
      filtered = filtered.filter((p) => {
        const val = Number(getDetail(p).numBedrooms || 0);
        return isPlus ? val >= min : val === min;
      });
    }

    if (f.bathrooms) {
      const value = f.bathrooms;
      filtered = filtered.filter((p) => {
        const baths = Number(getDetail(p).numBathrooms || 0);
        if (value.endsWith("+")) return baths >= Number(value.replace("+", ""));
        return baths === Number(value);
      });
    }

    if (f.totalArea) {
      const value = f.totalArea;
      filtered = filtered.filter((p) => {
        const area = Number(getDetail(p).totalArea || 0);
        if (value.includes("-")) {
          const [min, max] = value.split("-").map(Number);
          return area >= min && area <= max;
        }
        if (value.endsWith("+")) return area >= Number(value.replace("+", ""));
        return true;
      });
    }

    if (f.age) {
      const value = f.age;
      filtered = filtered.filter((p) => {
        const age = Number(getDetail(p).propertyAge || 0);
        if (value.includes("-")) {
          const [min, max] = value.split("-").map(Number);
          return age >= min && age <= max;
        }
        if (value.endsWith("+")) return age >= Number(value.replace("+", ""));
        return true;
      });
    }

    if (f.minPrice) {
      filtered = filtered.filter(
        (p) => Number(p.property?.rentPrice ?? 0) >= Number(f.minPrice)
      );
    }

    if (f.maxPrice) {
      filtered = filtered.filter(
        (p) => Number(p.property?.rentPrice ?? 0) <= Number(f.maxPrice)
      );
    }

    return filtered;
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
        <Filters value={filtersA} onFilterChange={handleFilterChange} />
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
          <p className="text-center text-muted fs-5">{noResults}</p>
          <div className="d-flex justify-content-center gap-2 mb-4">
            <Button
              variant="outline-secondary"
              onClick={() => setFiltersA(emptyFilters)}
            >
              Limpiar filtros
            </Button>
          </div>

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
