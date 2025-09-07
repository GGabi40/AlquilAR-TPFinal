import React, { useEffect, useState } from "react";
import "../../customStyle.css";

import { Link } from "react-router";
import { useLocation } from "react-router";
import LOGO from "/logo/techo-amarillo-blanco.webp";

const Nav = () => {
  const [showButton, setShowButton] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname !== "/login" ||
      location.pathname !== "/create-account"
    ) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  }, [location.pathname]);

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={LOGO} className="logo-alquilAR" alt="Logo AlquilAR" />
        </Link>

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
              <Link to="/" className="nav-link text-white">
                Publicar
              </Link>
            </li>
            {showButton && (
              <li className="nav-item">
                <Link to="/login" className="nav-link text-white d-lg-none">
                  Acceder
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-light ms-3 px-3 py-1 d-none d-lg-inline-block"
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
