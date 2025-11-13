import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router";

const PropertyCard = ({ post }) => {
  const navigate = useNavigate();
  const property = post.property || {};
  const detail = property.PropertyDetail || {};

  // Datos principales
  const idProperty = property.idProperty;
  const address = property.address || "Dirección no disponible";
  const rentPrice = property.rentPrice || 0;
  const propertyType = property.propertyType || "Propiedad";
  const locality = property.locality?.name || "";
  const province = property.province?.name || "";

  // Imagen principal
  const mainImage =
    detail?.PropertyImages?.[0]?.URLImages || "/photos/no-image.png";

  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="h-100 shadow-sm rounded-4 overflow-hidden">
      <div className="ratio ratio-4x3">
        <Card.Img
          variant="top"
          src={mainImage}
          alt={address}
          style={{ objectFit: "cover" }}
        />
      </div>

      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          {/* Título */}
          <Card.Title className="fw-bold d-flex justify-content-between">
            {post.title || propertyType}
            <button
              style={{ background: "transparent", border: "none" }}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <FontAwesomeIcon
                icon={isFavorite ? faHeart : faHeartRegular}
                style={{ color: "red" }}
                size="lg"
              />
            </button>
          </Card.Title>

          <Card.Text className="text-muted mb-1">{address}</Card.Text>

          <Card.Text className="text-muted">
            {locality} {province ? `- ${province}` : ""}
          </Card.Text>

          <Card.Text className="mb-1">
            <strong>Ambientes:</strong>{" "}
            {detail?.numRooms || "-"}
          </Card.Text>

          <Card.Text className="text-primary fw-bold fs-5">
            ${rentPrice}
          </Card.Text>
        </div>

        <Button
          variant="outline-primary"
          className="mt-3 rounded-pill"
          onClick={() => navigate(`/properties/${idProperty}`)}
        >
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
