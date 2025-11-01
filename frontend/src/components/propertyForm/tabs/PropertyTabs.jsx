import React from "react";
import { useNavigate, useLocation } from "react-router";
import "../customStyles/PropertyTabs.css";

const tabs = [
  { path: "/add-property/location", label: "Ubicación" },
  { path: "/add-property/features", label: "Características" },
  { path: "/add-property/images", label: "Imágenes y Documentación" },
];

const PropertyTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="tabs-container">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`tab-button ${active ? "active" : ""}`}
          >
            {tab.label}
            {active && <span className="active-line" />}
          </button>
        );
      })}
    </div>
  );
};

export default PropertyTabs;
