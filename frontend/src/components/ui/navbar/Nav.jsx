import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router";

import LOGO from "/logo/techo-amarillo-blanco.webp";
import "../../../customStyle.css";

import { AuthenticationContext } from "../../../services/auth.context";
import { getUserById } from "../../../services/userService.js";

const Nav = () => {
  const initialName = localStorage.getItem("userName");
  const { userId, token, handleUserLogout } = useContext(AuthenticationContext);
  const [user, setUser] = useState(initialName ? { name: initialName } : {});
  const location = useLocation();
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId && token) {
        try {
          const userData = await getUserById(userId, token);
          setUser(userData);
        } catch (error) {
          handleUserLogout();
          navigate("/login");
        }
      } else {
        setUser({});
      }
    };
    fetchUser();
  }, [userId, token]);

  const logout = () => {
    handleUserLogout();
    setUser({});
    navigate("/");
  };

  useEffect(() => {
    setShowButton(
      !(
        location.pathname === "/login" ||
        location.pathname === "/create-account"
      )
    );
  }, [location.pathname]);

  return (
    <nav
      className="navbar navbar-expand-lg bg-primary px-5"
      data-bs-theme="dark"
    >
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
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item">
              <Link
                className="nav-link px-3 py-1 text-white"
                to="/add-property"
              >
                Publicar
              </Link>
            </li>
            {/* Logout */}
            {!user.name && showButton && (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="btn btn-outline-light ms-3 px-3 py-1"
                >
                  Acceder
                </Link>
              </li>
            )}
            {/* Logged */}
            {user.name && (
              <li className="nav-item dropdown ms-3">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center text-white"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="avatar-circle me-2">
                    {user.name.charAt(0).toUpperCase()}
                    {user.surname.charAt(0).toUpperCase()}
                  </div>
                  {user.name} {user.surname}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/">
                      Mi perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/">
                      Favoritos
                    </Link>
                  </li>
                  <li>
                    <li>
                      {user.role === "owner" && (
                        <Link className="dropdown-item" to="/my-properties">
                          Mis propiedades
                        </Link>
                      )}

                      {user.role === "superadmin" && (
                        <Link className="dropdown-item" to="/admin">
                          Panel de Control
                        </Link>
                      )}
                    </li>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/faq">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
