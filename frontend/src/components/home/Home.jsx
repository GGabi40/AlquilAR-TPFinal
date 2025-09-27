import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Nav,
  Card,
  Button,
  Form,
  Carousel,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUsers,
  faHome,
  faHandshake,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [tipo, setTipo] = useState("casas");
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/properties/featured")
      .then((res) => setFeatured(res.data));
    axios
      .get("http://localhost:3000/api/properties/recent")
      .then((res) => setRecent(res.data));
  }, []);

  const featuredChunks = chunkArray(featured, 3);
  const recentChunks = chunkArray(
    recent.filter((p) => p.tipo === tipo),
    3
  );

  return (
    <>
      <div
        className="text-center p-5 my-3 img-width-100"
        style={{
          backgroundImage: "url('/photos/living-HomePage.png')",
        }}
      >
        <div
          className="bg-white bg-opacity-25 rounded-3 p-3 p-md-4 p-lg-5"
          style={{ width: "70%" }}
        >
          <h4 className="text-start text-white mb-3 fw-bold text-shadow fs-6">
            Encontrá tu próximo hogar
          </h4>
          <Form className="d-flex flex-column flex-md-row justify-content-center gap-2">
            <Form.Control
              type="text"
              placeholder="Ej: 2 ambientes en Buenos Aires"
              className="w-100 me-2 rounded-pill shadow-sm search-input"
              style={{ padding: "0.75rem 1.5rem" }}
            />
            <Button
              className="d-flex align-items-center rounded-pill px-4 btn-primary"
              onClick={() => navigate("/propiedades")}
            >
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              Buscar
            </Button>
          </Form>
        </div>
      </div>

      <Container className="my-5">
        <Row className="g-4">
          <Col md={3}>
            <Card body className="shadow-sm text-center login-form">
              <Card.Title>
                <FontAwesomeIcon
                  icon={faUsers}
                  size="2x"
                  className="mb-3 text-primary"
                />
              </Card.Title>
              <Card.Text>
                Conectate con dueños de todo el país sin vueltas
              </Card.Text>
            </Card>
          </Col>
          <Col md={3}>
            <Card body className="shadow-sm text-center login-form">
              <Card.Title>
                <FontAwesomeIcon
                  icon={faHome}
                  size="2x"
                  className="mb-3 text-success"
                />
              </Card.Title>
              <Card.Text>
                Encontrá tu hogar de forma simple y directa
              </Card.Text>
            </Card>
          </Col>
          <Col md={3}>
            <Card body className="shadow-sm text-center login-form">
              <Card.Title>
                <FontAwesomeIcon
                  icon={faHandshake}
                  size="2x"
                  className="mb-3 text-info"
                />
              </Card.Title>
              <Card.Text>De persona a persona, como debe ser</Card.Text>
            </Card>
          </Col>
          <Col md={3}>
            <Card body className="shadow-sm text-center login-form">
              <Card.Title>
                <FontAwesomeIcon
                  icon={faRoute}
                  size="2x"
                  className="mb-3 text-warning"
                />
              </Card.Title>
              <Card.Text>
                Simplificamos el camino hacia tu nuevo hogar
              </Card.Text>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="my-5">
        <h3 className="mb-3 fw-bold">Propiedades destacadas</h3>
        <Carousel>
          {featuredChunks.map((chunk, i) => (
            <Carousel.Item key={i}>
              <Row>
                {chunk.map((p) => (
                  <Col key={p.id} md={4}>
                    <Card className="shadow-sm">
                      <Card.Img variant="top" src={p.img} />
                      <Card.Body>
                        <Card.Title>{p.titulo}</Card.Title>
                        <Card.Text className="text-success fw-bold">
                          ${p.precio} - {p.hab} Hab.
                        </Card.Text>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/propiedad/${p.id}`)}
                        >
                          Ver más
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      <Container className="my-5">
        <h3 className="mb-3 fw-bold">Propiedades Recientes</h3>
        <Nav
          variant="tabs"
          defaultActiveKey="casas"
          onSelect={(k) => setTipo(k)}
        >
          <Nav.Item>
            <Nav.Link eventKey="casas">Casas</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="departamentos">Departamentos</Nav.Link>
          </Nav.Item>
        </Nav>

        <Carousel variant="dark">
          {recentChunks.map((chunk, i) => (
            <Carousel.Item key={i}>
              <Row>
                {chunk.map((p) => (
                  <Col key={p.id} md={4}>
                    <Card className="shadow-sm">
                      <Card.Img variant="top" src={p.imgUrl} />
                      <Card.Body>
                        <Card.Title>{p.titulo}</Card.Title>
                        <Card.Text className="text-success fw-bold">
                          ${p.precio} - {p.hab} Hab.
                        </Card.Text>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/propiedad/${p.id}`)}
                        >
                          Ver más
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      <div
        className="d-flex flex-column text-center mt-2 img-width-100 for-mobile gap-3"
        style={{
          backgroundImage: "url('/illustrations/bg-protruding-squares-2.svg')",
          backgroundSize: "auto"
        }}
      >
        <p className="lead fw-bold text-white fs-2 w-50 text-shadow">
          Donde los dueños encuentran inquilinos, y los inquilinos encuentran
          hogar
        </p>
        <Button
          variant="light"
          size="lg"
          className="fw-bold text-dark px-4 py-2 rounded-pill shadow-lg"
          onClick={() => navigate("/create-account")}
        >
          Sumate a AlquilAR
        </Button>
      </div>
    </>
  );
}
