import { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const clean = query.trim();
    onSearch({ q: clean }); // Se envía al padre
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-3 rounded-4 shadow-sm bg-light mb-0"
    >
      <Row className="g-2 align-items-center">
        <Col xs={12} md={9}>
          <Form.Control
            type="text"
            placeholder="Buscar por ciudad, provincia, dirección o tipo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="shadow-none"
          />
        </Col>

        <Col xs={12} md={3}>
          <Button type="submit" className="w-100 search-btn">
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Buscar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
