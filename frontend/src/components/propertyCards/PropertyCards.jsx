import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Form, Collapse, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router";
import usePagination from '../../hooks/usePagination.js';

const PropertyCards = () => {
    const [search, setSearch] = useState('');

    const [tipo, setTipo] = useState('');
    const [habitaciones, setHabitaciones] = useState('');
    const [ambientes, setAmbientes] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
    const [provincia, setProvincia] = useState('');
    const [localidad, setLocalidad] = useState('');

    const [filteredProperties, setFilteredProperties] = useState([]);


    const properties = [
        { id: 1, titulo: "San Lorenzo 1222", tipo: "Departamento", direccion: "Córdoba, Argentina", precio: 600000, hab: 3, img: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D", localidad: "Rosario", provincia: "Santa Fe" },
        { id: 2, titulo: "Av. Siempre Viva 742", tipo: "Casa", direccion: "Buenos Aires, Argentina", precio: 450000, hab: 2, img: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D", localidad: "Rio Cuarto", provincia: "Cordoba" },
        { id: 3, titulo: "Casa con Patio", tipo: "Casa", direccion: "Calle Falsa 123, Córdoba", precio: 850000, hab: 4, img: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D", localidad: "CABA", provincia: "Buenos Aires" },
        { id: 4, titulo: "depto en el Centro", tipo: "Departamento", direccion: "Córdoba 456, Rosario", precio: 700000, hab: 1, img: "https://via.placeholder.com/300x200?text=Loft+Centro", localidad: "La Plata", provincia: "Buenos Aires" },
        { id: 5, titulo: "Casa con Piscina", tipo: "Casa", direccion: "Ruta 9, Santa Fe", precio: 1200000, hab: 5, img: "https://via.placeholder.com/300x200?text=Casa+Piscina", localidad: "Santa Fe", provincia: "Santa Fe" },
        { id: 6, titulo: "Calle Falsa 123", direccion: "Rosario, Argentina", precio: 500000, tipo: "Departamento", hab: 4, img: "https://via.placeholder.com/300x200", localidad: "Bariloche", provincia: "Rio Negro" }
    ];
    // ver buscador, los filtros si andan bien 

    const handleApplyFilters  = () => {
        const results = properties.filter(p => {
            return (
                (tipo === '' || p.tipo === tipo) &&
                (habitaciones === '' || p.hab === parseInt(habitaciones)) &&
                (ambientes === '' || p.hab === parseInt(ambientes)) &&
                (precioMin === '' || p.precio >= parseInt(precioMin)) &&
                (precioMax === '' || p.precio <= parseInt(precioMax)) &&
                (provincia === '' || p.provincia.toLowerCase().includes(provincia.toLowerCase())) &&
                (localidad === '' || p.localidad.toLowerCase().includes(localidad.toLowerCase())) &&
                (search === '' || p.titulo.toLowerCase().includes(search.toLowerCase()))
            );
        });
        setFilteredProperties(results);
    }


    return (
        <div>
            <Container className="text-center my-5">
                <Form className="d-flex justify-content-center mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Buscar propiedades"
                        className="w-50 me-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="success">
                        <FontAwesomeIcon icon={faSearch} className="me-2" />Buscar
                    </Button>

                    <Dropdown className="ms-2">
                        <Dropdown.Toggle variant="outline-primary">
                            <FontAwesomeIcon icon={faFilter} /> Filtros
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-3" style={{ minWidth: "250px" }}>
                            <Form.Check
                                type="checkbox"
                                label="Departamentos"
                                checked={tipo === "Departamento"}
                                onChange={() => setTipo(tipo === "Departamento" ? "" : "Departamento")}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Casas"
                                checked={tipo === "Casa"}
                                onChange={() => setTipo(tipo === "Casa" ? "" : "Casa")}
                            />

                            <Form.Select
                                className="mt-2"
                                value={habitaciones}
                                onChange={e => setHabitaciones(e.target.value)}
                            >
                                <option value="">Habitaciones</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </Form.Select>

                            <Form.Select
                                className="mt-2"
                                value={ambientes}
                                onChange={e => setAmbientes(e.target.value)}
                            >
                                <option value="">Ambientes</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </Form.Select>

                            <Form.Control
                                className="mt-2"
                                type="number"
                                placeholder="Precio min"
                                value={precioMin}
                                onChange={e => setPrecioMin(e.target.value)}
                            />

                            <Form.Control
                                className="mt-2"
                                type="number"
                                placeholder="Precio max"
                                value={precioMax}
                                onChange={e => setPrecioMax(e.target.value)}
                            />

                            <Form.Control
                                className="mt-2"
                                type="text"
                                placeholder="Localidad"
                                value={localidad}
                                onChange={e => setLocalidad(e.target.value)}
                            />

                            <Form.Control
                                className="mt-2"
                                type="text"
                                placeholder="Provincia"
                                value={provincia}
                                onChange={e => setProvincia(e.target.value)}
                            />

                            <Button variant="success" className="mt-3 w-100" onClick={handleApplyFilters}>
                                <FontAwesomeIcon icon={faFilter} className="me-2" />Aplicar Filtros
                            </Button>

                        </Dropdown.Menu>
                    </Dropdown>
                </Form>
            </Container>

            <div className='d-flex flex-column align-items-center gap-3 w-100'>
                {(filteredProperties.length > 0 ? filteredProperties : properties).map((p) => (
                    <Card className="shadow-sm login-form" style={{ maxWidth: '500px', minWidth: '500px' }} key={p.id}>
                        <Row className="g-0" style={{ minHeight: '150px' }}>
                            <Col md={4} className='p-0'>
                                <Card.Img
                                    src={p.img}
                                    alt={p.titulo}
                                    style={{ width: "100%", height: '100%', objectFit: 'cover' }}
                                />
                            </Col>
                            <Col md={8} className="d-flex flex-column justify-content-between p-2">
                                <Card.Body>
                                    <Card.Title style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.titulo}</Card.Title>
                                    <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <strong>Dirección:</strong> {p.direccion} <br />
                                        <strong>Precio:</strong> ${p.precio} <br />
                                        <strong>Habitaciones:</strong> {p.hab}
                                    </Card.Text>

                                    <Button as={Link} to={`/property/${p.id}`} variant="primary">
                                        + Información
                                    </Button>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>

        </div>
    );
};

export default PropertyCards;
