import React from "react";
import { Outlet } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseCircleCheck } from "@fortawesome/free-solid-svg-icons";
import PropertyTabs from "./tabs/PropertyTabs";
import "./customStyles/PropertyDashboard.css";

const PropertyDashboard = () => {
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
