import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import RegisterImage from "/illustrations/register/register-illustration.webp";

import Notifications, {
  toastSuccess,
  toastError,
} from "../../ui/toaster/Notifications";

import {
  isEmpty,
  isValidEmail,
  hasMinLength,
  hasSQLInjection,
  hasScriptInjection,
  validateString,
} from "../../../utils/validations";

import TermsAndConditions from "../../pages/TermsAndCondicions";
import { Button, Modal } from "react-bootstrap";
import AuthLayout from "../AuthLayout";

const Register = () => {
  const [showTerms, setShowTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAndConditions: false,
  });
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const surnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const termsAndConditionsRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const validations = () => {
    let allErrors = {};

    if (isEmpty(formData.name)) {
      allErrors.name = "El nombre es obligatorio.";
      nameRef.current.classList.add("is-invalid");
      nameRef.current.classList.remove("is-valid");
    } else if (
      hasSQLInjection(formData.name) ||
      hasScriptInjection(formData.name) ||
      !validateString(formData.name, null, 25) ||
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.name)
    ) {
      allErrors.name = "Entrada inválida en el nombre.";
      nameRef.current.classList.add("is-invalid");
      nameRef.current.classList.remove("is-valid");
    } else {
      nameRef.current.classList.remove("is-invalid");
      nameRef.current.classList.add("is-valid");
    }

    if (isEmpty(formData.surname)) {
      allErrors.surname = "Los apellidos son obligatorios.";
      surnameRef.current.classList.add("is-invalid");
      surnameRef.current.classList.remove("is-valid");
    } else if (
      hasSQLInjection(formData.surname) ||
      hasScriptInjection(formData.surname) ||
      !validateString(formData.surname, null, 80) ||
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.surname)
    ) {
      allErrors.surname = "Entrada inválida en los apellidos.";
      surnameRef.current.classList.add("is-invalid");
      surnameRef.current.classList.remove("is-valid");
    } else {
      surnameRef.current.classList.remove("is-invalid");
      surnameRef.current.classList.add("is-valid");
    }

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

    if (
      hasSQLInjection(formData.password) ||
      hasScriptInjection(formData.password)
    ) {
      allErrors.password = "Entrada inválida.";
      passwordRef.current.classList.add("is-invalid");
      passwordRef.current.classList.remove("is-valid");
    } else if (!hasMinLength(formData.password, 6)) {
      allErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      passwordRef.current.classList.add("is-invalid");
      passwordRef.current.classList.remove("is-valid");
    } else {
      passwordRef.current.classList.remove("is-invalid");
      passwordRef.current.classList.add("is-valid");
    }

    if (formData.confirmPassword !== formData.password) {
      allErrors.confirmPassword = "Las contraseñas no coinciden.";
      confirmPasswordRef.current.classList.add("is-invalid");
      confirmPasswordRef.current.classList.remove("is-valid");
    } else if (!isEmpty(formData.confirmPassword)) {
      confirmPasswordRef.current.classList.remove("is-invalid");
      confirmPasswordRef.current.classList.add("is-valid");
    }

    if (!formData["termsAndConditions"]) {
      allErrors.termsChecked = "Debes aceptar los Términos y Condiciones.";
      termsAndConditionsRef.current?.classList.add("is-invalid");
    } else {
      termsAndConditionsRef.current?.classList.remove("is-invalid");
      termsAndConditionsRef.current?.classList.add("is-valid");
      delete allErrors.termsChecked;
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

    const API_URL = import.meta.env.VITE_BACKEND_ROUTE;

    try {
      const response = await axios.post(
        `${API_URL}/users/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toastSuccess("Cuenta creada con éxito");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
      } else {
        toastError("Error al crear la cuenta. Intenta de nuevo.");
      }
    }
  };

  return (
    <AuthLayout image={RegisterImage} title="AlquilAR tu hogar">
      <Notifications />
      <h4 className="card-title text-center mb-4">Crear cuenta</h4>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                ref={nameRef}
              />
            </div>
            {errors.name && (
              <div className="invalid-feedback d-block">{errors.name}</div>
            )}
          </div>
          <div className="col">
            <input
              type="text"
              name="surname"
              className="form-control"
              placeholder="Apellidos"
              value={formData.surname}
              onChange={handleChange}
              ref={surnameRef}
            />
            {errors.surname && (
              <div className="invalid-feedback d-block">{errors.surname}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              ref={emailRef}
            />
          </div>
          {errors.email && (
            <div className="invalid-feedback d-block">{errors.email}</div>
          )}
        </div>

        <div className="row mb-3">
          <div className="col">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                ref={passwordRef}
              />
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>
          <div className="col">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              ref={confirmPasswordRef}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <div
            className="input-group d-flex flex-row gap-2"
            style={{ fontSize: "12px" }}
          >
            <input
              type="checkbox"
              name="termsAndConditions"
              id="termsAndConditions"
              ref={termsAndConditionsRef}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="termsAndConditions">
              {" "}
              Leí y estoy de acuerdo con los
            </label>
            <Button
              variant="link"
              className="p-0 text-dark border-bottom"
              style={{ fontSize: "12px" }}
              onClick={() => setShowTerms(true)}
            >
              Términos y Condiciones
            </Button>
            <div className="invalid-feedback d-block">
              {errors.termsChecked}
            </div>
          </div>
        </div>

        <Modal
          show={showTerms}
          onHide={() => setShowTerms(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Términos y Condiciones</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TermsAndConditions />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTerms(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Crear Cuenta
          </button>
        </div>
      </form>
      <p className="text-center mt-3">
        ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
