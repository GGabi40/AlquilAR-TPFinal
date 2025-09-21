import React from 'react';
import { useNavigate, useLocation } from "react-router";

const PropertyTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // función para saber si una pestaña está activa
  const isActive = (path) => location.pathname === path;

  return (
    <div className="text-center mb-4">
      <button
        className={`btn btn-link mx-2 ${isActive("/add-property/location") ? "active-tab" : ""}`}
        onClick={() => navigate("/add-property/location")}
      >
        Ubicación
      </button>
      |
      <button
        className={`btn btn-link mx-2 ${isActive("/add-property/features") ? "active-tab" : ""}`}
        onClick={() => navigate("/add-property/features")}
      >
        Características
      </button>
      |
      <button
        className={`btn btn-link mx-2 ${isActive("/add-property/images") ? "active-tab" : ""}`}
        onClick={() => navigate("/add-property/images")}
      >
        Imágenes Y Documentación
      </button>
    </div>
  );
};

export default PropertyTabs;

import PropertyImageFeatures from "/illustrations/property-register/reg-prop-2.1.jpg";