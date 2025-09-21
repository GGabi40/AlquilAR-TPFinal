import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

import Notifications, {
  toastSuccess,
  toastError,
} from "../ui/toaster/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import LoginImage from "/illustrations/login/login-illustration.webp";
import {
  isEmpty,
  isValidEmail,
  hasSQLInjection,
  hasScriptInjection,
  hasMinLength,
} from "../../utils/validations";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    emailRef.current.classList.remove("is-invalid");
    emailRef.current.classList.remove("is-valid");
    passwordRef.current.classList.remove("is-invalid");
    passwordRef.current.classList.remove("is-valid");
    setErrors({ email: "", password: "" });
  }

  const validations = () => {
    let allErrors = {};

    if (isEmpty(formData.email)) {
      allErrors.email = "El email es obligatorio.";
      emailRef.current.classList.add("is-invalid");
      emailRef.current.classList.remove("is-valid");
    } else if (!isValidEmail(formData.email)) {
      allErrors.email = "El formato de email es inválido.";
      emailRef.current.classList.add("is-invalid");
      emailRef.current.classList.remove("is-valid");
    } else {
      emailRef.current.classList.remove("is-invalid");
      emailRef.current.classList.add("is-valid");
    }

    if (isEmpty(formData.password)) {
      allErrors.password = "La contraseña es obligatoria.";
      passwordRef.current.classList.add("is-invalid");
      passwordRef.current.classList.remove("is-valid");
    } else if (
      hasSQLInjection(formData.password) ||
      hasScriptInjection(formData.password)
    ) {
      allErrors.password = "Entrada inválida.";
      passwordRef.current.classList.add("is-invalid");
      passwordRef.current.classList.remove("is-valid");
    } else {
      passwordRef.current.classList.remove("is-invalid");
      passwordRef.current.classList.add("is-valid");
    }

    setErrors(allErrors);

    if (Object.keys(allErrors).length !== 0) {
      toastError("Revisa los errores del formulario.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validations();
    if (!validation) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toastSuccess("Sesión iniciada correctamente.");
      console.log("Datos de login:", formData);
      console.log("El servidor: ", response.data);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesion: ", error.message);
      toastError(
        error.response?.data?.message ||
          "Error al iniciar sesión. Intenta de nuevo."
      );
      emailRef.current.classList.add("is-invalid");
      passwordRef.current.classList.add("is-invalid");
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
                      name="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      ref={emailRef}
                      placeholder="ejemplo@mail.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                    <span
                      className="ms-2 text-primary d-none d-md-inline"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Debe tener al menos 6 caracteres"
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      ref={passwordRef}
                      placeholder="********"
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                  <small className="d-block mt-1">
                    <Link to="/password-recovery">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </small>
                </div>

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
