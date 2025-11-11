import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        ciudad: "",
        ambientes: "",
        tipo: "",
        precioMax: "",
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
        <Form onSubmit={handleSubmit} className="p-3 rounded shadow-sm bg-light mb-4">
            <Row className="g-2 align-items-center">
                <Col md={3}>
                    <Form.Control
                        type="text"
                        name="ciudad"
                        placeholder="Ciudad"
                        value={filters.ciudad}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={2}>
                    <Form.Select
                        name="ambientes"
                        value={filters.ambientes}
                        onChange={handleChange}
                    >
                        <option value="">Ambientes</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3+">3 o más</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select name="tipo" value={filters.tipo} onChange={handleChange}>
                        <option value="">Tipo de propiedad</option>
                        <option value="departamento">Departamento</option>
                        <option value="casa">Casa</option>
                        <option value="ph">PH</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Control
                        type="number"
                        name="precioMax"
                        placeholder="Precio máx."
                        value={filters.precioMax}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={2}>
                    <Button type="submit" className="w-100 btn-primary rounded-pill">
                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                        Buscar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchBar;
