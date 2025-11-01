import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import "../customStyles/PropertyFeatures.css";

const PropertyFeatures = () => {
  const navigate = useNavigate();

  const [habitaciones, setHabitaciones] = useState(0);
  const [ambientes, setAmbientes] = useState(1);
  const [banios, setBanios] = useState(1);
  const [superficie, setSuperficie] = useState("");
  const [antiguedad, setAntiguedad] = useState("");
  const [precioAlquiler, setPrecioAlquiler] = useState("");
  const [precioExpensas, setPrecioExpensas] = useState("");
  const [masInformacion, setMasInformacion] = useState("");
  const [errors, setErrors] = useState({});

  const handleSumar = (setter, valor) => setter(valor + 1);
  const handleRestar = (setter, valor) => valor > 0 && setter(valor - 1);
  const handleRestarBase = (setter, valor) => valor > 1 && setter(valor - 1);

  const validateForm = () => {
    const newErrors = {};

    const tipoPropiedad = document.querySelector(
      'input[name="tipoPropiedad"]:checked'
    );
    if (!tipoPropiedad)
      newErrors.tipoPropiedad = "Debe seleccionar un tipo de propiedad";

    const cochera = document.querySelector('input[name="cochera"]:checked');
    if (!cochera) newErrors.cochera = "Debe indicar si tiene cochera";

    const alquileres = document.querySelectorAll(
      'input[name="alquiler"]:checked'
    );
    if (alquileres.length === 0)
      newErrors.alquiler = "Debe seleccionar al menos un tipo de alquiler";

    if (ambientes < 1) newErrors.ambientes = "Debe indicar al menos 1 ambiente";
    if (banios < 1) newErrors.banios = "Debe indicar al menos 1 baño";

    if (superficie && parseFloat(superficie) <= 1)
      newErrors.superficie = "Ingrese un número válido";
    if (antiguedad && parseInt(antiguedad) < 0)
      newErrors.antiguedad = "Ingrese un número válido";

    if (
      isEmpty(precioAlquiler) ||
      isNaN(precioAlquiler) ||
      parseFloat(precioAlquiler) <= 0
    )
      newErrors.precioAlquiler = "Ingrese un precio de alquiler válido";

    if (
      isEmpty(precioExpensas) ||
      isNaN(precioExpensas) ||
      parseFloat(precioExpensas) < 0
    )
      newErrors.precioExpensas = "Ingrese un valor válido de expensas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      toastSuccess("Datos guardados correctamente 🚀");
      navigate("/add-property/images");
    } else {
      toastError("Por favor, complete correctamente los campos requeridos");
    }
  };

  return (
    <div className="property-step fade-in">
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
                <input type="radio" name="tipoPropiedad" id="casa" /> Casa
              </label>
              <label>
                <input type="radio" name="tipoPropiedad" id="departamento" />{" "}
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
                <input type="checkbox" name="alquiler" id="permanente" />{" "}
                Permanente
              </label>
              <label>
                <input type="checkbox" name="alquiler" id="temporal" /> Temporal
              </label>
            </div>
            {errors.alquiler && (
              <div className="text-danger">{errors.alquiler}</div>
            )}
          </div>
        </div>
      </div>

      {/* BLOQUE 2 - Cochera y contadores */}
      <div className="form-section mt-3">
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">
              Cochera<span className="required-star">*</span>
            </label>
            <div className="d-flex align-items-center gap-3">
              <label>
                <input type="radio" name="cochera" id="cochera-si" /> Sí
              </label>
              <label>
                <input type="radio" name="cochera" id="cochera-no" /> No
              </label>
            </div>
            {errors.cochera && (
              <div className="text-danger">{errors.cochera}</div>
            )}
          </div>

          <div className="col-md-3">
            <label>Habitaciones</label>
            <div className="counter-group">
              <button
                onClick={() => handleRestar(setHabitaciones, habitaciones)}
              >
                -
              </button>
              <span>{habitaciones}</span>
              <button
                onClick={() => handleSumar(setHabitaciones, habitaciones)}
              >
                +
              </button>
            </div>
          </div>

          <div className="col-md-3">
            <label>Ambientes</label>
            <div className="counter-group">
              <button onClick={() => handleRestarBase(setAmbientes, ambientes)}>
                -
              </button>
              <span>{ambientes}</span>
              <button onClick={() => handleSumar(setAmbientes, ambientes)}>
                +
              </button>
            </div>
          </div>

          <div className="col-md-3">
            <label>Baños</label>
            <div className="counter-group">
              <button onClick={() => handleRestarBase(setBanios, banios)}>
                -
              </button>
              <span>{banios}</span>
              <button onClick={() => handleSumar(setBanios, banios)}>+</button>
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE 3 - Superficie / antigüedad */}
      <div className="form-section mt-4">
        <div className="row">
          <div className="col-md-6">
            <label>Superficie (m²)</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faRulerCombined} />
              </span>
              <input
                type="number"
                placeholder="Ejemplo: 65"
                className={`form-control ${
                  errors.superficie ? "is-invalid" : ""
                }`}
                value={superficie}
                onChange={(e) => setSuperficie(e.target.value)}
              />
              <span className="input-group-text">
                m²
              </span>
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
              <span className="input-group-text">
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </span>
              <input
                type="number"
                placeholder="Ejemplo: 10"
                className={`form-control ${
                  errors.antiguedad ? "is-invalid" : ""
                }`}
                value={antiguedad}
                onChange={(e) => setAntiguedad(e.target.value)}
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
              <span className="input-group-text">
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </span>
              <input
                type="text"
                placeholder="Ingrese el monto mensual (ARS)"
                className={`form-control ${
                  errors.precioAlquiler ? "is-invalid" : ""
                }`}
                value={precioAlquiler}
                onChange={(e) => setPrecioAlquiler(e.target.value)}
              />
              <span className="input-group-text">
                AR$
              </span>
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
              <span className="input-group-text">
                <FontAwesomeIcon icon={faReceipt} />
              </span>
              <input
                type="text"
                placeholder="Ingrese el monto mensual (ARS)"
                className={`form-control ${
                  errors.precioExpensas ? "is-invalid" : ""
                }`}
                value={precioExpensas}
                onChange={(e) => setPrecioExpensas(e.target.value)}
              />
              <span className="input-group-text">
                AR$
              </span>
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
        <label>Más información</label>
        <div className="input-group">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faCircleInfo} />
          </span>
          <textarea
            className="form-control"
            rows="5"
            maxLength={300}
            placeholder="Agregue detalles relevantes: orientación, luminosidad, mascotas permitidas, etc."
            value={masInformacion}
            onChange={(e) => setMasInformacion(e.target.value)}
          />
        </div>
        <small className="text-muted d-block text-end">
          {masInformacion.length}/300
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
