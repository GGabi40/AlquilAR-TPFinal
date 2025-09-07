import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import RegisterImage from "/illustrations/register/register-illustration.webp";

const Register = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <img
            src={RegisterImage}
            alt="Ilustración de registro de usuario en AlquilAR"
            className="illustration-login img-fluid d-none d-md-block"
          />

          <h2 className="d-block d-md-none text-center fw-bold mt-3">
            AlquilAR tu hogar
          </h2>
        </div>

        <div className="col-md-5 register-form">
          <div className="card shadow h-100">
            <div className="card-body d-flex flex-column justify-content-center text-dark">
              <h4 className="card-title text-center mb-4">Crear cuenta</h4>

              <div className="row mb-3">
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre"
                    />
                  </div>
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Apellidos"
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Correo electrónico"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Contraseña"
                    />
                  </div>
                </div>
                <div className="col">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirmar contraseña"
                  />
                </div>
              </div>

              <div className="d-grid">
                <button className="btn btn-primary">Crear Cuenta</button>
              </div>

              <p className="text-center mt-3">
                ¿Ya tienes cuenta? <a href="/login">Iniciar Sesión</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
