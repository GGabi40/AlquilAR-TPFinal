import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Form, Collapse } from 'react-bootstrap';

const PropertyCards = () => {
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [tipo, setTipo] = useState('');
    const [habitaciones, setHabitaciones] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
    const [provincia, setProvincia] = useState('');
    const [localidad, setLocalidad] = useState('');
    
    const properties = [
        { id: 1, titulo: "San Lorenzo 1222", tipo: "Departamento", direccion: "Córdoba, Argentina", precio: 600000, hab: 3, img: "https://via.placeholder.com/300x200" },
        { id: 2, titulo: "Av. Siempre Viva 742", tipo: "Casa", direccion: "Buenos Aires, Argentina", precio: 450000, hab: 2, img: "https://via.placeholder.com/300x200" },
        { id: 3, titulo: "Casa con Patio", tipo: "Casa", direccion: "Calle Falsa 123, Córdoba", precio: 850000, hab: 4, img: "https://via.placeholder.com/300x200?text=Casa+con+Patio" },
        { id: 4, titulo: "depto en el Centro", tipo: "Departamento", direccion: "Córdoba 456, Rosario", precio: 700000, hab: 1, img: "https://via.placeholder.com/300x200?text=Loft+Centro" },
        { id: 5, titulo: "Casa con Piscina", tipo: "Casa", direccion: "Ruta 9, Santa Fe", precio: 1200000, hab: 5, img: "https://via.placeholder.com/300x200?text=Casa+Piscina" },
        { id: 6, titulo: "Calle Falsa 123", direccion: "Rosario, Argentina", precio: 500000, tipo: "Departamento", hab: 4, img: "https://via.placeholder.com/300x200" }
    ];
    // ver lo de provincia y localidad porque el amigo me dio solo direccion no localidad y provincia por separado

    const filteredProperties = properties.filter(p => {
        return (
            (tipo === '' || p.tipo === tipo) &&
            (habitaciones === '' || p.hab === parseInt(habitaciones)) &&
            (precioMin === '' || p.precio >= parseInt(precioMin)) &&
            (precioMax === '' || p.precio <= parseInt(precioMax)) &&
            (provincia === '' || p.direccion.toLowerCase().includes(provincia.toLowerCase())) &&
            (localidad === '' || p.direccion.toLowerCase().includes(localidad.toLowerCase())) &&
            (search === '' || p.titulo.toLowerCase().includes(search.toLowerCase()))
        );
    });



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
                    <Button variant="success">Buscar</Button>
                    <Button variant="outline-primary" className="ms-2" onClick={() => setShowFilters(!showFilters)}>
                        🔍 Filtros
                    </Button>
                </Form>
            </Container>

            <Collapse in={showFilters}>
                <div className="mb-3 border p-3 rounded">
                    <Row className="g-2">
                        <Col>
                            <Form.Select value={tipo} onChange={e => setTipo(e.target.value)}>
                                <option value="">Tipo</option>
                                <option value="Casa">Casa</option>
                                <option value="Departamento">Departamento</option>
                                <option value="Loft">Loft</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select value={habitaciones} onChange={e => setHabitaciones(e.target.value)}>
                                <option value="">Habitaciones</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Control
                                type="number"
                                placeholder="Precio min"
                                value={precioMin}
                                onChange={e => setPrecioMin(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                type="number"
                                placeholder="Precio max"
                                value={precioMax}
                                onChange={e => setPrecioMax(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Provincia"
                                value={provincia}
                                onChange={e => setProvincia(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Localidad"
                                value={localidad}
                                onChange={e => setLocalidad(e.target.value)}
                            />
                        </Col>
                    </Row>
                </div>
            </Collapse>


            <div className='d-flex flex-column align-items-center gap-3 w-100'>
                {filteredProperties.map((p) => (
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
                                    <Button variant="primary" href={`/property/${p.id}`}>+ Información</Button>
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
