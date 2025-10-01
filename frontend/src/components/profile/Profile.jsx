import React, { useState, useEffect, useContext } from "react";
import { AuthenticationContext } from "../../services/auth.context";
import { getUserById } from "../../services/userService";

const Profile = () => {
  const { userId, token } = useContext(AuthenticationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(userId, token);
        setUser(res);
      } catch (error) {
        console.error("Error al cargar usuario: ", error);
      }
    };
    fetchUser();
  }, [userId, token]);


  const handleEdit = () => {
    // Agg modal -> editar usuario
    console.log('En proceso...');
  }

  const handleDelete = () => {
    // Agg: Modal -> confirmar o no.
    // borrado lógico
    console.log('No hay acciones por ahora.');
  }

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 rounded-4 p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="d-flex flex-column align-items-center text-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: user?.avatarColor,
              width: "90px",
              height: "90px",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            {user?.name.charAt(0).toUpperCase()}
            {user?.surname.charAt(0).toUpperCase()}
          </div>

          <h3 className="mt-3 mb-1">
            {user?.name} {user?.surname}
          </h3>
          <span className="badge bg-secondary mb-3">
            {user?.role === "owner"
              ? "Propietario"
              : user?.role === "user"
              ? "Inquilino"
              : "Superadmin"}
          </span>

          <p className="text-muted">{user?.email}</p>

          <button className="btn btn-outline-primary mt-3 px-4" onClick={handleEdit}>
            Editar perfil
          </button>
          <button variant="danger" className="btn btn-danger mt-3 px-4" onClick={handleDelete}>
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
