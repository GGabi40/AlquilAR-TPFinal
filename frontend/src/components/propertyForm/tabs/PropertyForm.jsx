import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import {
  getProvinces,
  getLocalitiesByProvince,
} from "../../../servicesLocation/ServicesLocation";
import { toastSuccess, toastError } from "../../ui/toaster/Notifications";
import { isEmpty, validateString } from "../../../utils/validations";
import "../customStyles/PropertyForm.css";
import { PropertyContext } from "../../../services/property.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkedAlt,
  faCity,
  faHome,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";

import Notifications from "../../ui/toaster/Notifications";

const PropertyForm = () => {
  const { updateSection } = useContext(PropertyContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    provincia: "",
    localidad: "",
    barrio: "",
    direccion: "",
  });
  const [errors, setErrors] = useState({});
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("propertyLocationData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);

        setData((prevData) => ({
          ...prevData,
          ...parsedData,
        }));

        toastSuccess("Datos de ubicación recuperados 🏠");
    }
    const fetchProvincias = async () => {
      try {
        const provs = await getProvinces();
        setProvincias(provs);
      } catch (error) {
        toast.error('Algo pasó, intente nuevamente.');
      }
    };
    fetchProvincias();
  }, []);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceChange = async (e) => {
    const provincia = e.target.value;
    handleChange("provincia", provincia);
    handleChange("localidad", "");
    setLocalidades([]);

    if (!provincia) return;

    try {
      const localidades = await getLocalitiesByProvince(provincia);
      setLocalidades(localidades);
    } catch (error) {
      setLocalidades([]);
      toast.error('Algo pasó, intente nuevamente.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const regexBarrio = /^[a-zA-ZÀ-ÿ\s.\-]+$/;
    const regexDireccion = /^[a-zA-ZÀ-ÿ0-9\s.\-]+ [0-9]+$/;

    if (isEmpty(data.provincia))
      newErrors.provincia = "La provincia es obligatoria";
    if (isEmpty(data.localidad))
      newErrors.localidad = "La localidad es obligatoria";

    if (isEmpty(data.barrio)) {
      newErrors.barrio = "El barrio es obligatorio";
    } else if (!validateString(data.barrio, 3, 50)) {
      newErrors.barrio = "Debe tener entre 3 y 50 caracteres";
    } else if (!regexBarrio.test(data.barrio.trim())) {
      newErrors.barrio = "Solo se permiten letras y espacios";
    }

    if (isEmpty(data.direccion)) {
      newErrors.direccion = "La dirección es obligatoria";
    } else if (!validateString(data.direccion, 3, 50)) {
      newErrors.direccion = "Debe tener entre 3 y 50 caracteres";
    } else if (!regexDireccion.test(data.direccion.trim())) {
      newErrors.direccion = "Debe contener calle y número (Ej: San Martín 1234)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedData = {
        ...data
      };

      localStorage.setItem("propertyLocationData", JSON.stringify(updatedData));

      updateSection("location", updatedData);
      toastSuccess("Datos guardados correctamente 🚀");
      navigate("/add-property/features");
    } else {
      toastError("Por favor, completa todos los campos correctamente");
    }
  };

  return (
    <div className="property-step fade-in">
      <Notifications />
      <h3 className="step-title">Datos de Ubicación</h3>

      <form onSubmit={handleSubmit}>
        {/* Provincia */}
        <div className="mb-3 position-relative">
          <label className="form-label">
            Provincia<span className="required-star">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faMapMarkedAlt} />
            </span>
            <select
              className={`form-select ${errors.provincia ? "is-invalid" : ""}`}
              value={data.provincia}
              onChange={handleProvinceChange}
            >
              <option value="">Seleccione una provincia</option>
              {provincias.map((prov, index) => (
                <option key={index} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
          {errors.provincia && (
            <div className="invalid-feedback d-block">{errors.provincia}</div>
          )}
        </div>

        {/* Localidad */}
        <div className="mb-3 position-relative">
          <label className="form-label">
            Localidad<span className="required-star">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faCity} />
            </span>
            <select
              className={`form-select ${errors.localidad ? "is-invalid" : ""}`}
              value={data.localidad}
              onChange={(e) => handleChange("localidad", e.target.value)}
              disabled={!data.provincia || localidades.length === 0}
            >
              <option value="">
                {data.provincia
                  ? "Seleccione una localidad"
                  : "Seleccione una provincia primero"}
              </option>
              {localidades.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          {errors.localidad && (
            <div className="invalid-feedback d-block">{errors.localidad}</div>
          )}
        </div>

        {/* Barrio */}
        <div className="mb-3 position-relative">
          <label className="form-label">
            Barrio<span className="required-star">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faHome} />
            </span>
            <input
              type="text"
              className={`form-control ${errors.barrio ? "is-invalid" : ""}`}
              placeholder="Ingrese el barrio de la propiedad"
              value={data.barrio}
              onChange={(e) => handleChange("barrio", e.target.value)}
              required
            />
          </div>
          {errors.barrio && (
            <div className="invalid-feedback d-block">{errors.barrio}</div>
          )}
        </div>

        {/* Dirección */}
        <div className="mb-4 position-relative">
          <label className="form-label">
            Dirección<span className="required-star">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faMapPin} />
            </span>
            <input
              type="text"
              className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
              placeholder="Ejemplo: San Martín 1234"
              value={data.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              required
            />
          </div>
          {errors.direccion && (
            <div className="invalid-feedback d-block">{errors.direccion}</div>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary w-50">
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;