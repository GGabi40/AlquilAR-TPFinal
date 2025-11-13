import { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const clean = query.trim();
    onSearch({ q: clean }); // 👈 Se envía al padre
  };

  return (
    <div className="search-container position-relative">
      <Container>
        <Form
          onSubmit={handleSubmit}
          className="p-3 rounded shadow-sm bg-light mb-4"
        >
          <Row className="g-2 align-items-center">
            <Col md={10}>
              <Form.Control
                type="text"
                placeholder="Buscar por ciudad, provincia, dirección o tipo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="shadow-none"
              />
            </Col>

            <Col md={2}>
              <Button
                type="submit"
                className="w-100 btn-primary rounded-pill"
              >
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                Buscar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default SearchBar;
