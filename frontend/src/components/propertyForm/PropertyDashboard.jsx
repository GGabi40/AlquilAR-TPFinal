import React from "react";
import { Outlet } from "react-router";
import PropertyTabs from "./tabs/PropertyTabs";
import PropertyImageFeatures from "/illustrations/property-register/reg-prop-2.1.jpg";
import "./PropertyDashboard.css";

const PropertyDashboard = () => {
  return (
    <div className="property-dashboard fade-in">
      {/* CABECERA SUPERIOR: Ícono + Título */}
      <header className="dashboard-header">
        <div className="icon-wrapper">
          <img
            src={PropertyImageFeatures}
            alt="Ícono de registro de propiedad"
            className="dashboard-icon"
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
