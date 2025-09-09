import { useState } from "react";
import { Container, Row, Col, Nav, Card, Button, Form } from "react-bootstrap";

export default function Home() {
    const [tipo, setTipo] = useState("casas");

    const propiedades = [
        { id: 1, titulo: "San Lorenzo 1222", precio: 600000, hab: 3, img: "https://via.placeholder.com/300x200" },
        { id: 1, titulo: "San Lorenzo 1222", precio: 600000, hab: 3, img: "https://via.placeholder.com/300x200" },
        { id: 1, titulo: "San Lorenzo 1222", precio: 600000, hab: 3, img: "https://via.placeholder.com/300x200" }        
    ]; 

    return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">AlquiAR</a>
        <div className="ms-auto">
          <a href="/publicar" className="btn btn-light me-2">Publicar</a>
          <a href="./components/login/Login.jsx" className="btn btn-outline-light">Acceder</a>
        </div>
      </nav>

      <Container className="text-center my-5">
        <Form className="d-flex justify-content-center">
          <Form.Control type="text" placeholder="Buscador" className="w-50 me-2" />
          <Button variant="success">Buscar</Button>
        </Form>
      </Container>

      <Container className="my-5">
        <Row className="g-4">
          <Col md={3}><Card body className="shadow-sm">Conectate con dueños de todo el país sin vueltas</Card></Col>
          <Col md={3}><Card body className="shadow-sm">Encontrá tu próximo hogar de forma simple y directa</Card></Col>
          <Col md={3}><Card body className="shadow-sm">De persona a persona, como debe ser</Card></Col>
          <Col md={3}><Card body className="shadow-sm">Simplificamos el camino hacia tu nuevo hogar</Card></Col>
        </Row>
      </Container>

      <Container className="my-5">
        <h3 className="mb-3 fw-bold">Propiedades Más Visitadas</h3>
        <Nav variant="tabs" defaultActiveKey="casas" onSelect={(k) => setTipo(k)}>
          <Nav.Item><Nav.Link eventKey="casas">Casas</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="departamentos">Departamentos</Nav.Link></Nav.Item>
        </Nav>

        <Row className="mt-4">
          {propiedades.map((p) => (
            <Col key={p.id} md={4}>
              <Card className="shadow-sm">
                <Card.Img variant="top" src={p.img} />
                <Card.Body>
                  <Card.Title>{p.titulo}</Card.Title>
                  <Card.Text className="text-success fw-bold">
                    ${p.precio} - {p.hab} Hab.
                  </Card.Text>
                  <Button variant="primary" size="sm">Ver más</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="text-center my-5">
        <p className="lead">Donde los dueños encuentran inquilinos, y los inquilinos encuentran hogar.</p>
        <Button variant="success" size="lg">Sumate a AlquiAR</Button>
      </Container>

      <footer className="bg-dark text-light py-4 mt-5">
        <Container className="d-flex justify-content-between">
          <div>
            <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-light me-3"><i className="bi bi-instagram"></i></a>
            <a href="#" className="text-light"><i className="bi bi-twitter"></i></a>
          </div>
          <div>
            <a href="#" className="text-light me-3">FAQ</a>
            <a href="#" className="text-light me-3">Términos</a>
            <a href="#" className="text-light">Política</a>
          </div>
        </Container>
      </footer>
    </>
  );
}