import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  getProvinces,
  getLocalitiesByProvince,
} from "../../../servicesLocation/ServicesLocation";
import { toastSuccess, toastError } from "../../ui/toaster/Notifications";
import { isEmpty, validateString } from "../../../utils/validations";
import "../customStyles/PropertyForm.css";

const PropertyForm = () => {
  const navigate = useNavigate();

  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [barrio, setBarrio] = useState("");
  const [direccion, setDireccion] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getProvinces().then(setProvincias);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getLocalitiesByProvince(selectedProvince).then(setLocalidades);
    } else {
      setLocalidades([]);
    }
  }, [selectedProvince]);

  const validateForm = () => {
    const newErrors = {};
    const regexBarrio = /^[a-zA-ZÀ-ÿ\s.\-]+$/;
    const regexDireccion = /^[a-zA-ZÀ-ÿ0-9\s.\-]+ [0-9]+$/;

    if (isEmpty(selectedProvince))
      newErrors.provincia = "La provincia es obligatoria";
    if (isEmpty(selectedLocality))
      newErrors.localidad = "La localidad es obligatoria";

    if (isEmpty(barrio)) {
      newErrors.barrio = "El barrio es obligatorio";
    } else if (!validateString(barrio, 3, 50)) {
      newErrors.barrio = "Debe tener entre 3 y 50 caracteres";
    } else if (!regexBarrio.test(barrio.trim())) {
      newErrors.barrio = "Solo se permiten letras y espacios";
    }

    if (isEmpty(direccion)) {
      newErrors.direccion = "La dirección es obligatoria";
    } else if (!validateString(direccion, 3, 50)) {
      newErrors.direccion = "Debe tener entre 3 y 50 caracteres";
    } else if (!regexDireccion.test(direccion.trim())) {
      newErrors.direccion =
        "Debe contener calle y número (Ej: San Martín 1234)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      toastSuccess("Datos guardados correctamente 🚀");
      navigate("/add-property/features");
    } else {
      toastError("Por favor, completa todos los campos correctamente");
    }
  };

  return (
    <div className="property-step fade-in">
      <h3 className="step-title">Datos de Ubicación</h3>

      {/* Provincia */}
      <div className="mb-3">
        <label className="form-label">
          Provincia<span className="required-star">*</span>
        </label>
        <select
          className={`form-select ${errors.provincia ? "is-invalid" : ""}`}
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedLocality("");
          }}
        >
          <option value="">Seleccione una provincia</option>
          {provincias.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
        {errors.provincia && (
          <div className="invalid-feedback">{errors.provincia}</div>
        )}
      </div>

      {/* Localidad */}
      <div className="mb-3">
        <label className="form-label">
          Localidad<span className="required-star">*</span>
        </label>
        <select
          className={`form-select ${errors.localidad ? "is-invalid" : ""}`}
          value={selectedLocality}
          onChange={(e) => setSelectedLocality(e.target.value)}
          disabled={!selectedProvince}
        >
          <option value="">
            {selectedProvince
              ? "Seleccione una localidad"
              : "Seleccione una provincia primero"}
          </option>
          {localidades.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {errors.localidad && (
          <div className="invalid-feedback">{errors.localidad}</div>
        )}
      </div>

      {/* Barrio */}
      <div className="mb-3">
        <label className="form-label">
          Barrio<span className="required-star">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.barrio ? "is-invalid" : ""}`}
          placeholder="Ingrese el barrio de la propiedad"
          value={barrio}
          onChange={(e) => setBarrio(e.target.value)}
        />
        {errors.barrio && (
          <div className="invalid-feedback">{errors.barrio}</div>
        )}
      </div>

      {/* Dirección */}
      <div className="mb-4">
        <label className="form-label">
          Dirección<span className="required-star">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
          placeholder="Ejemplo: San Martín 1234"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        {errors.direccion && (
          <div className="invalid-feedback">{errors.direccion}</div>
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button
          type="button"
          className="btn btn-primary w-50"
          onClick={handleSubmit}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PropertyForm;
