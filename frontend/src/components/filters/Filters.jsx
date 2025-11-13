import { useState } from 'react';
import { Dropdown, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const Filters = ({ onFilterChange }) => {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({
        rooms: "",
        bedrooms: "",
        bathrooms: "",
        totalArea: "",
        age: "",
        minPrice: "",
        maxPrice: "",
        rentType: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        onFilterChange(filters);
        setOpen(false);
    };

    const clearFilters = () => {
        const cleared = {
            rooms: "",
            bedrooms: "",
            bathrooms: "",
            totalArea: "",
            age: "",
            minPrice: "",
            maxPrice: "",
            rentType: "",
        };
        setFilters(cleared);
        onFilterChange(cleared);
    };

    return (
        <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap">
            <Dropdown show={open} onToggle={() => setOpen(!open)} className="ms-2">
                <Dropdown.Toggle variant="outline-primary">
                    <FontAwesomeIcon icon={faFilter} /> Filtros
                </Dropdown.Toggle>

                <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>
                    {/* Ambientes */}
                    <Form.Select name="rooms" value={filters.rooms} onChange={handleChange} className="mb-2">
                        <option value="">Ambientes</option>
                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                        <option value="5+">5 o más</option>
                    </Form.Select>

                    {/* Dormitorios */}
                    <Form.Select name="bedrooms" value={filters.bedrooms} onChange={handleChange} className="mb-2">
                        <option value="">Dormitorios</option>
                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                        <option value="5+">5 o más</option>
                    </Form.Select>

                    {/* Baños */}
                    <Form.Select
                        name="bathrooms"
                        value={filters.bathrooms}
                        onChange={handleChange}
                        className="mb-2"
                    >
                        <option value="">Baños</option>
                        <option value="1">1</option>
                        <option value="2+">2 o más</option>
                    </Form.Select>

                    {/* Superficie */}
                    <Form.Select
                        name="totalArea"
                        value={filters.totalArea}
                        onChange={handleChange}
                        className="mb-2"
                    >
                        <option value="">Superficie</option>
                        <option value="0-50">Hasta 50 m²</option>
                        <option value="50-100">50 - 100 m²</option>
                        <option value="100+">Más de 100 m²</option>
                    </Form.Select>

                    {/* Antigüedad */}
                    <Form.Select
                        name="age"
                        value={filters.age}
                        onChange={handleChange}
                        className="mb-2"
                    >
                        <option value="">Antigüedad</option>
                        <option value="0-5">0 - 5 años</option>
                        <option value="5-15">5 - 15 años</option>
                        <option value="15+">Más de 15 años</option>
                    </Form.Select>

                    {/* Precio mínimo */}
                    <Form.Control
                        type="number"
                        name="minPrice"
                        placeholder="Precio mínimo"
                        value={filters.minPrice}
                        onChange={handleChange}
                        className="mb-2"
                    />

                    {/* Precio máximo */}
                    <Form.Control
                        type="number"
                        name="maxPrice"
                        placeholder="Precio máximo"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        className="mb-2"
                    />

                    {/* Botones */}
                    <Button variant="success" className="w-100 mb-2" onClick={applyFilters}>
                        <FontAwesomeIcon icon={faFilter} className="me-2" /> Aplicar filtros
                    </Button>
                    <Button variant="secondary" className="w-100" onClick={clearFilters}>
                        Limpiar filtros
                    </Button>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default Filters;