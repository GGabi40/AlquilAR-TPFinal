import React from "react";

const AuthLayout = ({ image, title, children }) => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <img
            src={image}
            alt={`Ilustración ${title}`}
            className="illustration-login img-fluid d-none d-md-block"
            style={{ objectFit: "cover" }}
          />
          <h2 className="d-block d-md-none text-center fw-bold mt-3">
            {title}
          </h2>
        </div>

        <div className="col-md-5">
          <div className="card shadow h-100">
            <div className="card-body d-flex flex-column justify-content-center text-dark">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
