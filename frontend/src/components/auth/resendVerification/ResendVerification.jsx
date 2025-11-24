import { useState } from "react";
import { resendVerification } from "../../../services/userService";
import Notifications, {
  toastSuccess,
  toastError,
} from "../../ui/toaster/Notifications";
import AuthLayout from "../AuthLayout";
import { Link } from "react-router";

import resendImage from '/illustrations/verify-email/verify-code.webp'

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toastError("Ingresá tu email.");

    setIsSubmitting(true);

    try {
      const res = await resendVerification(email);
      toastSuccess(res.message);
    } catch (error) {
      toastError(error.response?.data?.message || "Error al reenviar código.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout image={resendImage} title="Reenviar código de verificación">
      <Notifications />
      <h4 className="text-center mb-3">Reenviar verificación</h4>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@mail.com"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar código"}
        </button>

        <div className="mt-3 text-center">
          <Link to="/login">Volver a Login</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResendVerification;
