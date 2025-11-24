import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { toastError, toastSuccess } from "../../ui/toaster/Notifications";
import { Spinner } from "react-bootstrap";
import AuthLayout from "../AuthLayout";

import verifiedImage from '/illustrations/verify-email/verified.webp';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const API_URL = import.meta.env.VITE_BACKEND_ROUTE;
        const response = await axios.post(`${API_URL}/users/verify-email`, { token });

        console.log("Respuesta verificación:", response);

        setStatus("success");
        setMessage(response.data.message || "Cuenta verificada correctamente.");
        toastSuccess(response.data.message || "Cuenta verificada correctamente.");

        setTimeout(() => navigate("/login"), 2500);
      } catch (error) {
        setStatus("error");
        const errorMsg =
          error.response?.data?.message ||
          "Error al verificar el correo electrónico.";
        setMessage(errorMsg);
        toastError(errorMsg);
      }
    };

    if (token) verifyUser();
    else {
      setStatus("error");
      setMessage("Token inválido.");
      toastError("Token inválido.");
    }
  }, [token, navigate]);

  return (
    <AuthLayout image={verifiedImage} title="Verificación de correo electrónico">
      <div className="text-center mt-5">
        {status === "verifying" && (
          <>
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Verificando tu cuenta...</p>
          </>
        )}

        {/* exito */}
        {status === "success" && (
          <>
            <h4 className="text-success fw-bold mt-4">✅ {message}</h4>
            <p className="mt-2">Redirigiendo al inicio de sesión...</p>
          </>
        )}

        {/* error */}
        {status === "error" && (
          <>
            <h4 className="text-danger fw-bold mt-4">❌ Error en la verificación</h4>
            <p className="mt-2">{message}</p>

            <div className="mt-3">
              <Link to="/login" className="text-decoration-none">
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
