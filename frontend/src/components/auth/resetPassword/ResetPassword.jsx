import { useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import axios from "axios";

import Notifications, {
  toastSuccess,
  toastError,
} from "../../ui/toaster/Notifications";

import AuthLayout from "../AuthLayout";
import ResetPasswordImage from "/illustrations/forgot-pass/reset-password.webp";

import {
  isEmpty,
  hasSQLInjection,
  hasScriptInjection,
  hasMinLength,
} from "../../../utils/validations";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    passwordRef.current.classList.remove("is-invalid", "is-valid");
    confirmPasswordRef.current.classList.remove("is-invalid", "is-valid");
    setErrors({ password: "", confirmPassword: "" });
  };

  const validations = () => {
    let allErrors = {};

    if (isEmpty(formData.password)) {
      allErrors.password = "La contraseña es obligatoria.";
      passwordRef.current.classList.add("is-invalid");
    } else if (
      hasSQLInjection(formData.password) ||
      hasScriptInjection(formData.password)
    ) {
      allErrors.password = "Entrada inválida.";
      passwordRef.current.classList.add("is-invalid");
    } else if (!hasMinLength(formData.password, 6)) {
      allErrors.password = "Debe tener al menos 6 caracteres.";
      passwordRef.current.classList.add("is-invalid");
    } else {
      passwordRef.current.classList.add("is-valid");
    }

    if (formData.confirmPassword !== formData.password) {
      allErrors.confirmPassword = "Las contraseñas no coinciden.";
      confirmPasswordRef.current.classList.add("is-invalid");
    } else if (!isEmpty(formData.confirmPassword)) {
      confirmPasswordRef.current.classList.add("is-valid");
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
    if (!validations()) return;

    const API_URL = import.meta.env.VITE_BACKEND_ROUTE;

    try {
      const response = await axios.post(
        `${API_URL}/api/users/reset-password`,
        { token, newPassword: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );

      toastSuccess(
        response.data.message || "Contraseña restablecida con éxito."
      );
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toastError(
        error.response?.data?.message ||
          "Error al restablecer la contraseña. Intenta de nuevo."
      );
    }
  };

  return (
    <AuthLayout image={ResetPasswordImage} title="Restablecer tu contraseña">
      <Notifications />
      <h4 className="card-title text-center mb-4">Restablecer contraseña</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Nueva contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            ref={passwordRef}
            placeholder="********"
          />
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            ref={confirmPasswordRef}
            placeholder="********"
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback d-block">
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Restablecer
          </button>
        </div>
      </form>

      <p className="text-center mt-3">
        <Link to="/login">Volver al inicio de sesión</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;
