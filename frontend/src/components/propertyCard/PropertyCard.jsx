import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const PropertyCards = ({ property }) => {
  const {
    idProperty,
    title,
    city,
    address,
    price,
    rooms,
    type,
    images = [],
  } = property;

  const mainImage = images.length > 0 ? images[0].url : "/placeholder.jpg";
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="h-100 shadow-sm rounded-4 overflow-hidden">
      <div className="ratio ratio-4x3">
        <Card.Img
          variant="top"
          src={mainImage}
          alt={title}
          style={{ objectFit: "cover" }}
        />
      </div>
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fw-bold">
            {title || "Propiedad"}
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

          <Card.Text className="text-muted mb-1">{`${city} - ${address}`}</Card.Text>
          <Card.Text className="mb-1">
            <strong>Tipo:</strong> {type}
          </Card.Text>
          <Card.Text className="mb-1">
            <strong>Ambientes:</strong> {rooms}
          </Card.Text>
          <Card.Text className="text-primary fw-bold fs-5">${price}</Card.Text>
        </div>
        <Button
          variant="outline-primary"
          className="mt-3 rounded-pill"
          onClick={() => (window.location.href = `/property/${idProperty}`)}
        >
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PropertyCards;
