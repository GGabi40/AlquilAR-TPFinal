import React from "react";
import LoginImage from "/illustrations/login/login-illustration.webp";

import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <img
            src={LoginImage}
            alt="Ilustración inquilino agarrando la llave. Texto: Alquilar tu hogar."
            className="illustration-login img-fluid d-none d-md-block"
          />

          <h2 className="d-block d-md-none text-center fw-bold mt-3">
            AlquilAR tu hogar
          </h2>
        </div>

        <div className="col-md-5 login-form">
          <div className="card shadow h-100">
            <div className="card-body d-flex flex-column justify-content-center text-dark">
              <h4 className="card-title text-center mb-4">Iniciar sesión</h4>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="ejemplo@mail.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="********"
                  />
                </div>
                <small className="d-block mt-1">
                  <Link to="/password-recovery">¿Olvidaste tu contraseña?</Link>
                </small>
              </div>

              <div className="d-grid">
                <button className="btn btn-primary">Iniciar Sesión</button>
              </div>

              <p className="text-center mt-3">
                ¿No tienes cuenta? <Link to="/create-account">Crear cuenta</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
