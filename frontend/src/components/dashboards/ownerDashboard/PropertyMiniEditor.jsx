import { useEffect, useState, useContext } from "react";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AuthenticationContext } from "../../../services/auth.context.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMoneyBillWave,
  faRulerCombined,
  faMapMarkerAlt,
  faDoorOpen,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import PropertyServices from "../../../services/propertyServices.js";

export default function PropertyMiniEditor({ propertyId }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthenticationContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await PropertyServices.getPropertyById(propertyId, token);
        setProperty(data);
      } catch (error) {
        console.error("Error al obtener propiedad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, token]);

  if (loading)
    return (
      <div className="text-center my-4">
        <Spinner animation="border" /> <p>Cargando datos de la propiedad...</p>
      </div>
    );

  if (!property) return <p>No se pudo cargar la propiedad.</p>;

  const details = property.PropertyDetail;
  const images = details?.PropertyImages || [];

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4 mt-3">
      <h5 className="fw-bold mb-3">
        <FontAwesomeIcon icon={faHome} className="me-2 text-primary" />
        {property.propertyType?.toUpperCase()}
      </h5>

      <Row className="mb-3">
        <Col md={6}>
          <p className="mb-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-secondary" />
            <strong>Dirección:</strong> {property.address}
          </p>
          <p className="mb-1">
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2 text-secondary" />
            <strong>Alquiler:</strong> ${property.rentPrice}
          </p>
          <p className="mb-1">
            <FontAwesomeIcon icon={faRulerCombined} className="me-2 text-secondary" />
            <strong>Superficie:</strong> {details?.totalArea || "-"} m²
          </p>
        </Col>

        <Col md={6}>
          <p className="mb-1">
            <FontAwesomeIcon icon={faDoorOpen} className="me-2 text-secondary" />
            <strong>Ambientes:</strong> {details?.numRooms}
          </p>
          <p className="mb-1">
            <FontAwesomeIcon icon={faHome} className="me-2 text-secondary" />
            <strong>Dormitorios:</strong> {details?.numBedrooms}
          </p>
          <p className="mb-1">
            <FontAwesomeIcon icon={faHome} className="me-2 text-secondary" />
            <strong>Baños:</strong> {details?.numBathrooms}
          </p>
        </Col>
      </Row>

      {/* Miniaturas de imágenes */}
      {images.length > 0 && (
        <>
          <h6 className="fw-semibold mt-3 mb-3">
            <FontAwesomeIcon icon={faImage} className="me-2 text-primary" />
            Imágenes actuales
          </h6>

          <Row>
            {images.slice(0, 3).map((img) => (
              <Col key={img.idPropertyImages} md={4} className="mb-3">
                <Card className="border-0 shadow-sm rounded-3 h-100">
                  <Card.Img
                    src={img.URLImages}
                    className="rounded-3"
                    style={{
                      height: "140px",
                      objectFit: "cover",
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <div className="text-center mt-4">
        <Button
          variant="outline-primary"
          className="px-4 py-2 rounded-3"
          onClick={() => navigate(`/property/edit/${propertyId}`)}
        >
          Editar Propiedad Completa
        </Button>
      </div>
    </Card>
  );
}
