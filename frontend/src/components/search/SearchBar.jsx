import { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        provincia: "",
        ciudad: "",
        tipo: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <div className="search-container position-relative">
            <Container>
                <Form onSubmit={handleSubmit}
                    className="p-3 rounded shadow-sm bg-light mb-4">
                    <Row className="g-2 align-items-center">
                        <Col md={3}>
                            <Form.Control
                                type="text"
                                name="provincia"
                                placeholder="Provincia"
                                value={filters.provincia}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="text"
                                name="ciudad"
                                placeholder="Ciudad"
                                value={filters.ciudad}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Select name="tipo" value={filters.tipo} onChange={handleChange}>
                                <option value="">Tipo de propiedad</option>
                                <option value="departamento">Departamento</option>
                                <option value="casa">Casa</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button type="submit" className="w-100 btn-primary rounded-pill">
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
