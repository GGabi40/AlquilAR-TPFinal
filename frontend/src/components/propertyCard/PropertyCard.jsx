import { Card, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router";
import { formatApproxAddress } from "../../services/formatAddress";

const PropertyCard = ({ post, view = "grid" }) => {
  const navigate = useNavigate();

  const prop = post.property || {};
  const detail = prop.PropertyDetail || {};

  const mainImage =
    detail.PropertyImages?.[0]?.URLImages || "/photos/no-image.png";

  if (view === "list") {
    return (
      <Card className="shadow-sm mx-auto mb-3" style={{ maxWidth: "850px" }}>
        <Row className="g-0">
          <Col md={4}>
            <Card.Img
              src={mainImage}
              style={{ height: "100%", objectFit: "cover" }}
            />
          </Col>

          <Col md={8} className="p-3 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold">{post.title}</h5>

              <p className="mb-1"><strong>Dirección:</strong> {formatApproxAddress(prop.address)}</p>
              <p className="mb-1"><strong>Ambientes:</strong> {detail.numRooms || "-"}</p>
              <p className="mb-1"><strong>Ciudad:</strong> {prop.locality?.name}</p>
              <p className="mb-1 text-primary fw-bold">Precio: ${prop.rentPrice}</p>
            </div>

            <Button
              variant="primary"
              className="rounded-pill mt-2"
              onClick={() => navigate(`/properties/${prop.idProperty}`)}
            >
              Ver detalles
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }

  // MODO GRID
  return (
    <Card className="h-100 shadow-sm rounded-4 overflow-hidden">
      <div className="ratio ratio-4x3">
        <Card.Img
          src={mainImage}
          style={{ objectFit: "cover" }}
        />
      </div>

      <Card.Body>
        <h5 className="fw-bold">{post.title}</h5>
        <p className="text-muted">{formatApproxAddress(prop.address)}</p>
        <p className="fw-bold text-primary">${prop.rentPrice}</p>

        <Button
          variant="outline-primary"
          className="rounded-pill"
          onClick={() => navigate(`/properties/${prop.idProperty}`)}
        >
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
