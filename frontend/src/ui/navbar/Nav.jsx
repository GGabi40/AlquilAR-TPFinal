import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import LOGO from "/logo/techo-amarillo-blanco.webp";
import "../../customStyle.css";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showButton, setShowButton] = useState(true);


  useEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/create-account") {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
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
              <button
                className="btn btn-light nav-link px-3 py-1"
                onClick={() => navigate("/add-property/location")}
              >
                Publicar
              </button>
            </li>
            {showButton && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-3 px-3 py-1"
                  onClick={() => navigate("/login")}
                >
                  Acceder
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
