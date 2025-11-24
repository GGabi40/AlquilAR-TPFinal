import { useState, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

import Notifications, {
  toastSuccess,
  toastError
} from "../../ui/toaster/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import LoginImage from "/illustrations/login/login-illustration.webp";
import {
  isEmpty,
  isValidEmail,
  hasSQLInjection,
  hasScriptInjection,
} from "../../../utils/validations";

import { AuthenticationContext } from "../../../services/auth.context";
import AuthLayout from "../AuthLayout";
import { login } from "../../../services/userService.js";

const Login = () => {
  const { handleUserLogin } = useContext(AuthenticationContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  };

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

    setIsSubmitting(true);
    try {
      const response = await login(formData);

      if (response.token) {
        handleUserLogin(response.token);
      }
      
      toastSuccess("Sesión iniciada correctamente.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toastError(
        error.response?.data?.message || "Error al iniciar sesión. Intenta de nuevo."
      );
      emailRef.current.classList.add("is-invalid");
      passwordRef.current.classList.add("is-invalid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout image={LoginImage} title="AlquilAR tu hogar">
      <Notifications />
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
            <div className="invalid-feedback d-block">{errors.email}</div>
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
            <div className="invalid-feedback d-block">{errors.password}</div>
          )}
          <small className="d-block mt-1">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </small>
          <small className="d-block mt-2">
            <Link to="/resend-verification">¿No recibiste el código de verificación?</Link>
          </small>
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </div>
      </form>
      <p className="text-center mt-3">
        ¿No tienes cuenta? <Link to="/create-account">Crear cuenta</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
