import { useState } from "react";
import { useNavigate, Link } from "react-router";
import LoginImage from "/illustrations/login/login-illustration.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "superadmin"){
        navigate("/superadmin");
      }else if (data.user.role === "owner") {
        navigate("/owner-dashboard");
      }else {
        navigate("/user-dashboard");
      } 
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container my-5">
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
            <form onSubmit={handleLogin}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@mail.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                </div>
                <small className="d-block mt-1">
                  <Link to="/password-recovery">¿Olvidaste tu contraseña?</Link>
                </small>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="d-grid">
                <button className="btn btn-primary" type="submit">
                  Iniciar Sesión
                </button>
              </div>
             </form>

              <p className="text-center mt-3">
                ¿No tienes cuenta? {" "}
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
