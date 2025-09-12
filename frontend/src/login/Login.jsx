import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";

import Notifications, {
  toastSuccess,
  toastError,
  toastInfo,
} from "../ui/toaster/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import LoginImage from "/illustrations/login/login-illustration.webp";
import {
  isEmpty,
  isValidEmail,
  hasSQLInjection,
  hasScriptInjection,
  hasMinLength,
} from "../utils/validations";

const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const handleEmailChange = (e) =>
    setUserData({ ...userData, email: e.target.value });
  const handlePasswordChange = (e) =>
    setUserData({ ...userData, password: e.target.value });

  const validations = () => {
    let allErrors = {};

    if (isEmpty(userData.email)) {
      toastError("El email es obligatorio.");
      allErrors.email = "El email es obligatorio.";
      emailRef.current.focus();
      emailRef.current.classList.add("is-invalid");
    } else if (!isValidEmail(userData.email)) {
      toastError("El formato de email es inválido.");
      allErrors.email = "El formato de email es inválido.";
      emailRef.current.focus();
      emailRef.current.classList.add("is-invalid");
    }

    if (
      hasSQLInjection(userData.password) ||
      hasScriptInjection(userData.password)
    ) {
      allErrors.password = "Entrada inválida";
    } else if (!hasMinLength(userData.password, 6)) {
      allErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      passwordRef.current.focus();
      passwordRef.current.classList.add("is-invalid");
    }

    setErrors(allErrors);

    if (Object.keys(allErrors).length !== 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validations();

    if(isValid)
    {
      emailRef.current.classList.remove("is-invalid");
      passwordRef.current.classList.remove("is-invalid");

      toastSuccess('Sesión iniciada correctamente.');
      // CONECTAR
      // HACER TOAST DE SUCESS
      /* try {
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "superadmin") {
        navigate("/superadmin");
      } else if (data.user.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } */
    }
  };

  return (
    <div className="container my-5">
      <Notifications />
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
              <form onSubmit={handleSubmit}>
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
                      value={userData.email}
                      onChange={handleEmailChange}
                      ref={emailRef}
                      placeholder="ejemplo@mail.com"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                    <div className="tooltip-container ms-2">
                      <span
                        className="ms-2 text-primary d-none d-md-block"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Debe tener al menos 6 caracteres"
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </span>
                    </div>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={userData.password}
                      onChange={handlePasswordChange}
                      ref={passwordRef}
                      placeholder="********"
                      required
                    />
                  </div>
                  <small className="d-block mt-1">
                    <Link to="/password-recovery">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </small>
                </div>

                {errors.email && (
                  <div className="alert alert-danger">{errors.email}</div>
                )}
                {errors.password && (
                  <div className="alert alert-danger">{errors.password}</div>
                )}

                <div className="d-grid">
                  <button className="btn btn-primary" type="submit">
                    Iniciar Sesión
                  </button>
                </div>
              </form>

              <p className="text-center mt-3">
                ¿No tienes cuenta?{" "}
                <Link to="/create-account">Crear cuenta</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
