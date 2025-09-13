import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import LOGO from "/logo/techo-amarillo-blanco.webp";
import "../../customStyle.css";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    setShowButton(!(location.pathname === "/login" || location.pathname === "/create-account"));
  }, [location.pathname]);

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <img
          src={LOGO}
          className="logo-alquilAR"
          alt="Logo AlquilAR"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        <button
          className="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className="nav-link px-3 py-1 text-white"
                to="/add-property" // si está logueado: va a formulario
              >
                Publicar
              </Link>
            </li>
            {showButton && (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="btn btn-outline-light ms-3 px-3 py-1"
                >
                  Acceder
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
