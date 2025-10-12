import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPalette,
  faTrash,
  faFloppyDisk
} from "@fortawesome/free-solid-svg-icons";
import { Container, Card } from "react-bootstrap";

import ConfirmModal from "../ui/modal/ConfirmModal.jsx";

import Notifications, {
  toastSuccess,
  toastError,
} from "../ui/toaster/Notifications";

import {
  isEmpty,
  hasSQLInjection,
  hasScriptInjection,
  validateString,
} from "../../utils/validations.js";

import { getTextColor } from "../../utils/textColors.js";
import { AuthenticationContext } from "../../services/auth.context";
import { updateUser, delUser, getUserById } from "../../services/userService";

const Profile = () => {
  const navigate = useNavigate();
  const { userId, token, logout } = useContext(AuthenticationContext);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    avatarColor: "#ffc107",
  });
  const [showDelete, setShowDelete] = useState(false);
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const surnameRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(userId, "users", token);
        setUser(res);
        setFormData(res);
      } catch (error) {
        console.error("Error al cargar usuario: ", error);
      }
    };
    fetchUser();
  }, [userId, token]);

  const validateForm = () => {
    let allErrors = {};

    if (isEmpty(formData.name)) {
      allErrors.name = "El nombre es obligatorio.";
      nameRef.current.classList.add("is-invalid");
    } else if (
      hasSQLInjection(formData.name) ||
      hasScriptInjection(formData.name) ||
      !validateString(formData.name, null, 25) ||
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.name)
    ) {
      allErrors.name = "Entrada inválida en el nombre.";
      nameRef.current.classList.add("is-invalid");
    } else {
      nameRef.current.classList.remove("is-invalid");
    }

    if (isEmpty(formData.surname)) {
      allErrors.surname = "Los apellidos son obligatorios.";
      surnameRef.current.classList.add("is-invalid");
    } else {
      surnameRef.current.classList.remove("is-invalid");
    }

    setErrors(allErrors);
    if (Object.keys(allErrors).length !== 0) {
      toastError("Revisa los errores del formulario.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateUser(userId, "users", formData, token);
      toastSuccess("Perfil actualizado correctamente ✅");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      toastError("Error al actualizar el perfil ❌");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await delUser(userId, 'users', token);
      toastSuccess("Cuenta eliminada");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("No se pudo eliminar la cuenta ❌");
    }
  };

  if (!user) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card
        className="shadow-lg border-0 rounded-4 p-4 w-100"
        style={{ maxWidth: "600px" }}
      >
        <Notifications />
        <h4 className="card-title text-center mb-4">Editar perfil</h4>

        <form onSubmit={handleUpdate}>
          <div className="d-flex flex-column align-items-center mb-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: formData.avatarColor || "#ffc107",
                color: getTextColor(formData.avatarColor || "#ffc107"),
                border: '0.25px solid black',
                width: "90px",
                height: "90px",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {formData.name?.charAt(0).toUpperCase()}
              {formData.surname?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
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

            <div className="col-md-6">
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
                readOnly
                disabled
                className="form-control"
                placeholder="Correo electrónico"
                value={formData.email}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/change-email")}
                variant='info'
              >
                Cambiar
              </button>
            </div>
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold d-block mb-2">
              <FontAwesomeIcon icon={faPalette} className="me-2 text-warning" />
              Color del avatar
            </label>

            {/* Input color */}
            <div
              className="d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm"
              style={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #e0e0e0",
              }}
            >
              <input
                type="color"
                name="avatarColor"
                value={formData.avatarColor || "#007bff"}
                onChange={handleChange}
                title="Elegí un color"
                className="form-control form-control-color border-0"
                style={{
                  cursor: "pointer",
                  width: "70px",
                  height: "40px",
                  background: "transparent",
                }}
              />

              <small className="text-muted ms-2">
                Tocá para elegir un color
              </small>
            </div>
          </div>

          <div className="d-grid gap-3">
            <button className="btn btn-primary" type="submit">
              <FontAwesomeIcon icon={faFloppyDisk} className="me-2" />
              Guardar cambios
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => setShowDelete(true)}
            >
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Eliminar cuenta
            </button>
          </div>
        </form>
      </Card>

      {/* MODAL */}
      <ConfirmModal
        show={showDelete}
        title="Confirmar eliminación"
        message="⚠️ Esta acción eliminará permanentemente tu cuenta. ¿Deseas continuar?"
        onConfirm={handleDelete}
        onClose={() => setShowDelete(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </Container>
  );
};

export default Profile;
