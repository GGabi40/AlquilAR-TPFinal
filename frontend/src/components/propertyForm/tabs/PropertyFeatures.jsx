import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { toastSuccess, toastError } from "../../ui/toaster/Notifications";
import { isEmpty } from "../../../utils/validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRulerCombined,
  faClockRotateLeft,
  faMoneyBillWave,
  faReceipt,
  faCircleInfo,
  faHouse,
  faCouch,
  faBath,
} from "@fortawesome/free-solid-svg-icons";
import "../customStyles/PropertyFeatures.css";
import { PropertyContext } from "../../../services/property.context";
import Notifications from "../../ui/toaster/Notifications";

const PropertyFeatures = () => {
  const navigate = useNavigate();
  const { updateSection } = useContext(PropertyContext);


  const [data, setData] = useState({
    tipoPropiedad: "",
    alquileres: [],
    habitaciones: 0,
    ambientes: 1,
    banios: 1,
    superficie: "",
    antiguedad: "",
    precioAlquiler: "",
    precioExpensas: "",
    masInformacion: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const locationData = localStorage.getItem("propertyLocationData");
    if (!locationData) {
      toastError("Completa primero la ubicación 🏠");
      navigate("/add-property/location");
      return;
    }

    const savedFeatures = localStorage.getItem("propertyFeaturesData");
    if (savedFeatures){
      try {
        const parsed = JSON.parse(savedFeatures);
        setData((prev) => ({...prev, ...parsed}));
        toastSuccess("Datos de caracteristicas recuperados!");
      } catch (error){
        console.error("Error al cargar las caracteristicas de las propiedades", error);
      }
    }
  }, [navigate]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setData((prev) => {
      const updated = checked
        ? [...prev.alquileres, value]
        : prev.alquileres.filter((v) => v !== value);
      return { ...prev, alquileres: updated };
    });
  };

  const handleCounter = (field, type) => {
    setData((prev) => {
      const current = prev[field];
      if (type === "sumar") return { ...prev, [field]: current + 1 };
      if (type === "restar") {
        const min = field === "ambientes" || field === "banios" ? 1 : 0;
        return { ...prev, [field]: current > min ? current - 1 : current };
      }
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!data.tipoPropiedad)
      newErrors.tipoPropiedad = "Debe seleccionar un tipo de propiedad";
    if (data.alquileres.length === 0)
      newErrors.alquiler = "Debe seleccionar al menos un tipo de alquiler";
    if (data.ambientes < 1)
      newErrors.ambientes = "Debe indicar al menos 1 ambiente";
    if (data.banios < 1)
      newErrors.banios = "Debe indicar al menos 1 baño";

    if (data.superficie && parseFloat(data.superficie) <= 1)
      newErrors.superficie = "Ingrese un número válido";
    if (data.antiguedad && parseInt(data.antiguedad) < 0)
      newErrors.antiguedad = "Ingrese un número válido";

    if (
      isEmpty(data.precioAlquiler) ||
      isNaN(data.precioAlquiler) ||
      parseFloat(data.precioAlquiler) <= 0
    )
      newErrors.precioAlquiler = "Ingrese un precio de alquiler válido";

    if (
      isEmpty(data.precioExpensas) ||
      isNaN(data.precioExpensas) ||
      parseFloat(data.precioExpensas) < 0
    )
      newErrors.precioExpensas = "Ingrese un valor válido de expensas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      updateSection("features", data);
      localStorage.setItem("propertyFeaturesData", JSON.stringify(data));

      toastSuccess("Datos guardados correctamente 🚀");
      navigate("/add-property/images");
    } else {
      toastError("Por favor, complete correctamente los campos requeridos");
    }
  };

  return (
    <div className="property-step fade-in">
      <Notifications />
      <h3 className="step-title">Características de la Propiedad</h3>

      {/* BLOQUE 1 - Tipo */}
      <div className="form-section">
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">
              Tipo de propiedad<span className="required-star">*</span>
            </label>
            <div className="d-flex align-items-center gap-3">
              <label>
                <input
                  type="radio"
                  name="tipoPropiedad"
                  value="Casa"
                  checked={data.tipoPropiedad === "Casa"}
                  onChange={(e) => handleChange("tipoPropiedad", e.target.value)}
                />{" "}
                Casa
              </label>
              <label>
                <input
                  type="radio"
                  name="tipoPropiedad"
                  value="Departamento"
                  checked={data.tipoPropiedad === "Departamento"}
                  onChange={(e) => handleChange("tipoPropiedad", e.target.value)}
                />{" "}
                Departamento
              </label>
            </div>
            {errors.tipoPropiedad && (
              <div className="text-danger">{errors.tipoPropiedad}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Tipo de alquiler<span className="required-star">*</span>
            </label>
            <div className="d-flex align-items-center gap-3">
              <label>
                <input
                  type="checkbox"
                  value="Permanente"
                  checked={data.alquileres.includes("Permanente")}
                  onChange={handleCheckboxChange}
                />{" "}
                Permanente
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Temporal"
                  checked={data.alquileres.includes("Temporal")}
                  onChange={handleCheckboxChange}
                />{" "}
                Temporal
              </label>
            </div>
            {errors.alquiler && (
              <div className="text-danger">{errors.alquiler}</div>
            )}
          </div>
        </div>
      </div>

      {/* BLOQUE 2 - contadores */}
      <div className="form-section mt-3">
        <div className="row justify-content-center">
          {/* Habitaciones */}
          <div className="col-md-3">
            <label>
              <FontAwesomeIcon icon={faHouse} className="me-2 text-primary" />
              Habitaciones
            </label>
            <div className="counter-group">
              <button onClick={() => handleCounter("habitaciones", "restar")}>
                -
              </button>
              <span>{data.habitaciones}</span>
              <button onClick={() => handleCounter("habitaciones", "sumar")}>
                +
              </button>
            </div>
          </div>

          {/* Ambientes */}
          <div className="col-md-3">
            <label>
              <FontAwesomeIcon icon={faCouch} className="me-2 text-primary" />
              Ambientes
            </label>
            <div className="counter-group">
              <button onClick={() => handleCounter("ambientes", "restar")}>
                -
              </button>
              <span>{data.ambientes}</span>
              <button onClick={() => handleCounter("ambientes", "sumar")}>
                +
              </button>
            </div>
          </div>

          {/* Baños */}
          <div className="col-md-3">
            <label>
              <FontAwesomeIcon icon={faBath} className="me-2 text-primary" />
              Baños
            </label>
            <div className="counter-group">
              <button onClick={() => handleCounter("banios", "restar")}>
                -
              </button>
              <span>{data.banios}</span>
              <button onClick={() => handleCounter("banios", "sumar")}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE 3 - Superficie / antigüedad */}
      <div className="form-section mt-4">
        <div className="row">
          <div className="col-md-6">
            <label>
              Superficie (m²)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FontAwesomeIcon icon={faRulerCombined} />
              </span>
              <input
                type="number"
                placeholder="Ejemplo: 65"
                className={`form-control ${
                  errors.superficie ? "is-invalid" : ""
                }`}
                value={data.superficie}
                onChange={(e) => handleChange("superficie", e.target.value)}
              />
              <span className="input-group-text">m²</span>
            </div>
            {errors.superficie && (
              <div className="invalid-feedback d-block">
                {errors.superficie}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label>Antigüedad (años)</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </span>
              <input
                type="number"
                placeholder="Ejemplo: 10"
                className={`form-control ${
                  errors.antiguedad ? "is-invalid" : ""
                }`}
                value={data.antiguedad}
                onChange={(e) => handleChange("antiguedad", e.target.value)}
              />
            </div>
            {errors.antiguedad && (
              <div className="invalid-feedback d-block">
                {errors.antiguedad}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BLOQUE 4 - Precios */}
      <div className="form-section mt-4">
        <div className="row">
          <div className="col-md-6">
            <label>
              Precio de Alquiler<span className="required-star">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </span>
              <input
                type="text"
                placeholder="Ingrese el monto mensual (ARS)"
                className={`form-control ${
                  errors.precioAlquiler ? "is-invalid" : ""
                }`}
                value={data.precioAlquiler}
                onChange={(e) =>
                  handleChange("precioAlquiler", e.target.value)
                }
              />
              <span className="input-group-text">AR$</span>
            </div>
            {errors.precioAlquiler && (
              <div className="invalid-feedback d-block">
                {errors.precioAlquiler}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label>
              Expensas<span className="required-star">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FontAwesomeIcon icon={faReceipt} />
              </span>
              <input
                type="text"
                placeholder="Ingrese el monto mensual (ARS)"
                className={`form-control ${
                  errors.precioExpensas ? "is-invalid" : ""
                }`}
                value={data.precioExpensas}
                onChange={(e) =>
                  handleChange("precioExpensas", e.target.value)
                }
              />
              <span className="input-group-text">AR$</span>
            </div>
            {errors.precioExpensas && (
              <div className="invalid-feedback d-block">
                {errors.precioExpensas}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BLOQUE 5 - Más información */}
      <div className="form-section mt-4">
        <label>Comentanos más!!</label>
        <div className="input-group">
          <span className="input-group-text bg-light">
            <FontAwesomeIcon icon={faCircleInfo} />
          </span>
          <textarea
            className="form-control"
            rows="5"
            maxLength={500}
            placeholder="Agregue detalles relevantes: tiene cochera, orientación, luminosidad, mascotas permitidas, etc."
            value={data.masInformacion}
            onChange={(e) => handleChange("masInformacion", e.target.value)}
          />
        </div>
        <small className="text-muted d-block text-end">
          {data.masInformacion.length}/500
        </small>
      </div>

      {/* Botones */}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button
          type="button"
          className="btn btn-secondary w-25"
          onClick={() => navigate("/add-property/location")}
        >
          Volver
        </button>
        <button
          type="button"
          className="btn btn-primary w-25"
          onClick={handleSubmit}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PropertyFeatures;
