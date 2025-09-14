import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import imageNotFound from "/notFound/notFound.webp";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            padding: "0 20px",
        }}>
            <img
                src={imageNotFound}
                alt="Ilustración de error 404 - AlquilAR"
                style={{ maxWidth: "400px", height: "auto", marginBottom: "20px" }}
                
            />
            <h2>Página no encontrada</h2>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <Button variant="primary" onClick={() => navigate("/")}>
                Volver al inicio
            </Button>
        </div>
    );
};

export default NotFound;