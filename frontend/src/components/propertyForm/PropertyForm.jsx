import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import PropertyImage from "/illustrations/property-register/reg-prop-1.1.jpg";
import PropertyTabs from './PropertyTabs';
import { getProvinces, getLocalitiesByProvince } from '../../servicesLocation/ServicesLocation';

import { toastSuccess, toastError } from "../ui/toaster/Notifications";

import { isEmpty, validateString } from "../../utils/validations";

const PropertyForm = () => {
    const navigate = useNavigate();

    const [provincia, setProvincia] = useState([]);
    const [localidad, setLocalidad] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [barrio, setBarrio] = useState("");
    const [direccion, setDireccion] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getProvinces().then(setProvincia)
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            getLocalitiesByProvince(selectedProvince).then(setLocalidad);
        } else {
            setLocalidad([]);
        }
    }, [selectedProvince]);


    const validateForm = () => {
        const newErrors = {};
        const regexEspacios = /^[a-zA-ZÀ-ÿ\s\.\-]+$/;


        if (isEmpty(selectedProvince)) {
            newErrors.provincia = "La provincia es obligatoria";
        }

        if (isEmpty(localidad)) {
            newErrors.localidad = "La localidad es obligatoria";
        }

        if (isEmpty(barrio)) {
            newErrors.barrio = "El barrio es obligatorio";
        } else if (!validateString(barrio, 3, 50)) {
            newErrors.barrio = "El barrio debe tener entre 3 y 50 caracteres";
        } else if (!regexEspacios.test(barrio.trim())) {
            newErrors.barrio = "El barrio solo puede contener letras y espacios"
        }

        if (isEmpty(direccion)) {
            newErrors.direccion = "La dirección es obligatoria";
        } else if (!validateString(direccion, 3, 50)) {
            newErrors.direccion = "La dirección debe tener entre 3 y 50 caracteres";
        } else {
            const regex = /^[a-zA-ZÀ-ÿ0-9\s\.\-]+ [0-9]+$/;
            if (!regex.test(direccion.trim())) {
                newErrors.direccion = "La dirección debe contener calle y número (ej: San Martín 1234)";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        setErrors({});
        if (validateForm()) {
            toastSuccess("Datos guardados correctamente 🚀");
            navigate("/add-property/features");
        } else {
            toastError("Por favor, completa todos los campos");
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center align-items-center">

                <div className="col-md-5 d-flex justify-content-center align-items-center">
                    <img
                        src={PropertyImage}
                        alt="Ilustración de registro de propiedad en AlquilAR"
                        className="illustration-login img-fluid d-none d-md-block"
                    />

                    <h2 className="d-block d-md-none text-center fw-bold mt-3">
                        AlquilAR tu hogar
                    </h2>
                </div>


                <div className="col-md-6 d-flex justify-content-center align-items-center  login-form">
                    <div className="card shadow h-100">


                        <div className="register-form">
                            <div className="card shadow h-100">
                                <div className="card-body d-flex flex-column justify-content-center text-dark">
                                    <h2 className="card-title text-center mb-4">Registra tu Propiedad</h2>
                                    <PropertyTabs />
                                    <div className="mb-3">
                                        <label className="form-label d-inline">Provincia<span className="required-star"> *</span></label>
                                        <select
                                            className={`form-select ${errors.provincia ? "is-invalid" : ""}`}
                                            value={provincia}
                                            onChange={(e) => {
                                                setSelectedProvince(selectedProvince);
                                                setLocalidad(""); // limpiar localidad al cambiar provincia
                                                validateForm();
                                            }}
                                            required
                                        >
                                            <option value="">Seleccione una provincia</option>
                                            {provincia.map((prov) => (
                                                <option key={prov} value={prov}>
                                                    {prov}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.provincia && <div className="invalid-feedback">{errors.provincia}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label d-inline">Localidad <span className="required-star">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.localidad ? "is-invalid" : ""}`}
                                            value={localidad}
                                            onChange={(e) => {
                                                setLocalidad(e.target.value);
                                                validateForm();
                                            }}
                                            required
                                            disabled={!provincia} // desactiva hasta que se elija una provincia
                                        >
                                            <option value="">
                                                {provincia ? "Seleccione una localidad" : "Seleccione una provincia primero"}
                                            </option>
                                            {localidad.map((loc) => (
                                                <option key={loc} value={loc}>
                                                    {loc}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.localidad && <div className="invalid-feedback">{errors.localidad}</div>}
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label d-inline">Barrio <span className="required-star">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.barrio ? "is-invalid" : ""}`}
                                            placeholder='Ingrese el Barrio de la Propiedad'
                                            value={barrio}
                                            onChange={(e) => {
                                                setBarrio(e.target.value.trimStart());
                                                validateForm();
                                            }}
                                        />
                                        {errors.barrio && <div className="invalid-feedback">{errors.barrio}</div>}
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label d-inline">Dirección <span className="required-star">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                                            placeholder='Dirección de la Propiedad'
                                            value={direccion}
                                            onChange={(e) => {
                                                setDireccion(e.target.value.trimStart());
                                                validateForm();
                                            }}
                                        />
                                        {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                                    </div>


                                    <div className="d-flex justify-content-center">
                                        <button type="button" className="btn btn-primary w-50" onClick={handleSubmit}>
                                            Continuar
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PropertyForm;


