import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";

import Notifications, {
  toastError,
  toastInfo,
} from "../../ui/toaster/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import ForgotPasswordImage from "/illustrations/forgot-pass/forgot-password.webp"; 

import {
  isEmpty,
  isValidEmail,
  hasSQLInjection,
  hasScriptInjection,
} from "../../../utils/validations";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [isSent, setIsSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const emailRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    emailRef.current.classList.remove("is-invalid");
    emailRef.current.classList.remove("is-valid");
    setErrors({ email: "" });
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
    } else if (
      hasSQLInjection(formData.email) ||
      hasScriptInjection(formData.email)
    ) {
      allErrors.email = "Entrada inválida.";
      emailRef.current.classList.add("is-invalid");
      emailRef.current.classList.remove("is-valid");
    } else {
      emailRef.current.classList.remove("is-invalid");
      emailRef.current.classList.add("is-valid");
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
        "http://localhost:3000/api/users/forgot-password",
        { email: formData.email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toastInfo(
        "Si el correo ingresado está registrado, recibirás un enlace de recuperación."
      );
      setCooldown(30);
      setIsSent(true);
    } catch (error) {
      console.error("Error en recuperación: ", error.message);
      toastInfo(
        "Si el correo ingresado está registrado, recibirás un enlace de recuperación."
      );
      setCooldown(30);
      setIsSent(true);
    }
  };

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  return (
    <div className="container my-5">
      <Notifications />
      <div className="row justify-content-center">
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <img
            src={ForgotPasswordImage}
            alt="Ilustración de recuperación de contraseña."
            className="illustration-login img-fluid d-none d-md-block"
          />
          <h2 className="d-block d-md-none text-center fw-bold mt-3">
            Recupera tu acceso
          </h2>
        </div>

        <div className="col-md-5 login-form">
          <div className="card shadow h-100">
            <div className="card-body d-flex flex-column justify-content-center text-dark">
              <h4 className="card-title text-center mb-4">
                Recuperar contraseña
              </h4>
              {isSent && (
                <div className="alert alert-info text-center" role="alert">
                  Si el correo ingresado está registrado, recibirás un enlace de
                  recuperación.
                  <br />
                  <strong>
                    Revisa tu bandeja de entrada o correo no deseado.
                  </strong>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
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

                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={cooldown > 0}
                  >
                    {cooldown > 0
                      ? `Reintentar en ${cooldown}s`
                      : "Enviar enlace"}
                  </button>
                </div>
              </form>

              <p className="text-center mt-3">
                <Link to="/login">Volver al inicio de sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
