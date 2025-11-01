import React from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseCircleCheck } from "@fortawesome/free-solid-svg-icons";
import PropertyTabs from "./tabs/PropertyTabs";
import "./customStyles/PropertyDashboard.css";

const PropertyDashboard = () => {
  const location = useLocation();

  if(location.pathname === "/add-property" || location.pathname === "/add-property/") return <Navigate to="location" replace />;

  return (
    <div className="property-dashboard fade-in">
      {/* CABECERA SUPERIOR: Ícono + Título */}
      <header className="dashboard-header">
        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={faHouseCircleCheck}
            className="dashboard-fa-icon"
          />
        </div>
        <h2 className="dashboard-title">Registro de Propiedad</h2>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="property-right">
        <PropertyTabs />
        <section className="property-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default PropertyDashboard;
