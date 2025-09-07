import React from "react";

const Login = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        {/* Columna izquierda (puede ser una imagen o un placeholder) */}
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <div className="bg-light border" style={{ width: "300px", height: "300px" }}>
            {/* Aquí podrías poner un logo o ilustración */}
          </div>
        </div>

        {/* Columna derecha (formulario) */}
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Login</h4>

              {/* Correo */}
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
                    placeholder="ejemplo@mail.com"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="********"
                />
                <small className="d-block mt-1">
                  <a href="#">¿Olvidaste tu contraseña?</a>
                </small>
              </div>

              {/* Botón login */}
              <div className="d-grid">
                <button className="btn btn-primary">Iniciar Sesión</button>
              </div>

              {/* Crear cuenta */}
              <p className="text-center mt-3">
                ¿No tienes cuenta? <a href="#">Crear cuenta</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
