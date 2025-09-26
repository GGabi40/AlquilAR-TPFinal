import React, { useEffect, useState } from "react";

export default function UserDashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        setUser(savedUser);
    }, []);

    const property = {
        direccion: "7 de Julio 1288",
        ambientes: 2,
        banos: 1,
        descripcion: "Living y Comedor - Espacio Amplio",
        alquiler: 520000,
        expensas: 100000,
        rating: 4.8,
    };

    if (!user) return <p>Cargando datos...</p>;

    return (
        <div className="container py-4">

            <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">AlquilAR</span>
                    <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle bg-light me-2"
                            style={{ width: "30px", height: "30px" }}
                        ></div>
                        <span className="text-white">{user}</span>
                    </div>
                </div>
            </nav>

            <h2 className="mb-4">Bienvenido/a {user.name},</h2>

            <div className="card shadow">
                <div className="row g-0">
                    <div className="col-md-4 d-flex align-items-center justify-content-center bg-light">
                        <span className="text-muted">Imagen Propiedad</span>
                    </div>

                    <div className="col-md-8">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    Propiedad {property.direccion}
                                </h5>
                                <span className="text-warning fw-bold">
                                    {property.rating} ★
                                </span>
                            </div>
                            <p className="card-text mt-2">
                                {property.ambientes} Amb. | {property.banos} baño
                            </p>
                            <p className="card-text">{property.descripcion}</p>
                            <p className="card-text">
                                <strong>Alq:</strong> $
                                {property.alquiler.toLocaleString("es-AR")}
                            </p>
                            <p className="card-text">
                                <strong>Exp:</strong> $
                                {property.expensas.toLocaleString("es-AR")}
                            </p>

                            <div className="mt-3">
                                <button className="btn btn-danger me-2">Reportar</button>
                                <button className="btn btn-outline-primary me-2">
                                    Ver Contrato
                                </button>
                                <button className="btn btn-secondary">Datos del Propietario</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}