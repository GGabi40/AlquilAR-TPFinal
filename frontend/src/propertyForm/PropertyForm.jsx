import { use } from 'react';
import React, { useState } from 'react';
import { useNavigate } from "react-router";
import PropertyImage from "/illustrations/property-register/reg-prop-1.1.jpg";
import PropertyTabs from './PropertyTabs';

import Notifications, {
    toastSuccess,
    toastError,
} from "../ui/toaster/Notifications";

import {
    isEmpty,
    validateString,
} from "../utils/validations";

const PropertyForm = () => {
    const navigate = useNavigate();

    const [provincia, setProvincia] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [barrio, setBarrio] = useState("");
    const [direccion, setDireccion] = useState("");
    const [errors, setErrors] = useState({});

    //ver bien lo de las validaciones no andan 

    const validateForm = () => {
        const newErrors = {};

        if (isEmpty(provincia)) {
            newErrors.provincia = "La provincia es obligatoria";
        } else if (!validateString(provincia, 3, 50)) {
            newErrors.provincia = "La provincia debe tener entre 3 y 50 caracteres";
        }

        if (isEmpty(localidad)) {
            newErrors.localidad = "La localidad es obligatoria";
        } else if (!validateString(localidad, 3, 50)) {
            newErrors.localidad = "La localidad debe tener entre 3 y 50 caracteres";
        }

        if (isEmpty(barrio)) {
            newErrors.barrio = "El barrio es obligatorio";
        } else if (!validateString(barrio, 3, 50)) {
            newErrors.barrio = "El barrio debe tener entre 3 y 50 caracteres";
        }

        if (isEmpty(direccion)) {
            newErrors.direccion = "La dirección es obligatoria";
        } else if (!validateString(direccion, 3, 50)) {
            newErrors.direccion = "La dirección debe tener entre 3 y 50 caracteres";
        } else {
            const regex = /^[a-zA-ZÀ-ÿ\s]+[\s]+[0-9]+$/;
            if (!regex.test(direccion.trim())) {
                newErrors.direccion = "La dirección debe contener calle y número (ej: San Martín 1234)";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
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
                                        <label className="form-label">Provincia:</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder='Ingrese su Provincia'
                                            value={provincia}
                                            onChange={(e) => setProvincia(e.target.value)}
                                        />
                                        {errors.provincia && <div className="invalid-feedback">{errors.provincia}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Localidad:</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder='Ingrese su Localidad/Ciudad'
                                            value={localidad}
                                            onChange={(e) => setLocalidad(e.target.value)}
                                        />
                                        {errors.localidad && <div className="invalid-feedback">{errors.localidad}</div>}
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">Barrio:</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder='Ingrese el Barrio de la Propiedad'
                                            value={barrio}
                                            onChange={(e) => setBarrio(e.target.value)}
                                        />
                                        {errors.barrio && <div className="invalid-feedback">{errors.barrio}</div>}
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">Dirección:</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder='Dirección de la Propiedad'
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
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


