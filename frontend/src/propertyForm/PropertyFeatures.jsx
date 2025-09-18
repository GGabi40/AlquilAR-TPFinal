import React, { useState } from 'react';
import { useNavigate } from "react-router";
import PropertyImageFeatures from "/illustrations/property-register/reg-prop-2.1.jpg";
import PropertyTabs from './PropertyTabs';

import { toastSuccess, toastError } from "../ui/toaster/Notifications";

import { isEmpty } from "../utils/validations";

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
    const handleRestar = (setter, valor) => {
        if (valor > 0) setter(valor - 1);
    };
    const handleRestarBase = (setter, valor) => {
        if (valor > 1) setter(valor - 1);
    };

    const validateForm = () => {
        const newErrors = {};

        const tipoPropiedad = document.querySelector('input[name="tipoPropiedad"]:checked');
        if (!tipoPropiedad) newErrors.tipoPropiedad = "Debe seleccionar un tipo de propiedad";

        const cochera = document.querySelector('input[name="cochera"]:checked');
        if (!cochera) newErrors.cochera = "Debe indicar si tiene cochera";

        const alquileres = document.querySelectorAll('input[name="alquiler"]:checked');
        if (alquileres.length === 0) newErrors.alquiler = "Debe seleccionar al menos un tipo de alquiler";

        if (ambientes < 1) newErrors.ambientes = "Debe indicar al menos 1 ambiente";
        if (banios < 1) newErrors.banios = "Debe indicar al menos 1 baño";

        if (superficie && parseFloat(superficie) <= 1) newErrors.superficie = "Ingrese un número válido";
        if (antiguedad && parseInt(antiguedad) < 0) newErrors.antiguedad = "Ingrese un número válido";

        if (isEmpty(precioAlquiler) || isNaN(precioAlquiler) || parseFloat(precioAlquiler) <= 0)
            newErrors.precioAlquiler = "Ingrese un precio de alquiler válido";
        if (isEmpty(precioExpensas) || isNaN(precioExpensas) || parseFloat(precioExpensas) < 0)
            newErrors.precioExpensas = "Ingrese un valor válido de expensas";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            toastSuccess("Datos guardados correctamente 🚀");
            navigate("/add-property/images");
        } else {
            toastError("Por favor, ingrese correctamente los datos en el formulario");
        }
    }

    return (
        <div className="container my-5">

            <div className="row justify-content-center align-items-center">

                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img
                        src={PropertyImageFeatures}
                        alt="Ilustración de registro de caracteristicas de la propiedad en AlquilAR"
                        className="illustration-login img-fluid d-none d-md-block"
                    />

                    <h2 className="d-block d-md-none text-center fw-bold mt-3">
                        AlquilAR tu hogar
                    </h2>
                </div>

                <div className='col-md-6 d-flex justify-content-center align-items-center  login-form'>
                    <div className='card shadow h-100'>

                        <div className='register-form'>
                            <div className='card shadow h-100'>
                                <div className='card-body d-flex flex-column justify-content-center text-dark'>
                                    <h2 className='card-title text-center mb-4'>Registro de tu Propiedad</h2>
                                    <PropertyTabs />



                                    <div className='row mb-3'>
                                        <div className='col-md-6'>
                                            <div>
                                                <label className="form-label d-block d-inline">Elija su propiedad<span className="required-star"> *</span></label>
                                                <input
                                                    type="radio"
                                                    name="tipoPropiedad"
                                                    id="casa"
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="casa" className='me-3'>
                                                    Casa
                                                </label>
                                                <input
                                                    type="radio"
                                                    name="tipoPropiedad"
                                                    id="departamento"
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="departamento">
                                                    Departamento
                                                </label>
                                                {errors.tipoPropiedad && <div className="text-danger">{errors.tipoPropiedad}</div>}
                                            </div>
                                        </div>
                                        <br />

                                        <div className='col-md-6'>
                                            <label className="form-label d-block d-inline">¿Cómo te gustaría alquilar?<span className="required-star"> *</span></label>
                                            <div>
                                                <input
                                                    type='checkbox'
                                                    name="alquiler"
                                                    id="alquilercompleto"
                                                    className='form-check-label' />
                                                <label htmlFor="alquilercompleto" className="me-3">Alquiler Permanente</label>
                                                <br />
                                                <input
                                                    type='checkbox'
                                                    name="alquiler"
                                                    id="alquilertemporario"
                                                    className='form-check-label' />
                                                <label htmlFor="alquilertemporario">Alquiler Temporal</label>
                                                {errors.alquiler && <div className="text-danger">{errors.alquiler}</div>}
                                            </div>
                                        </div>
                                        <br />

                                    </div>

                                    <div className='row mb-3'>
                                        <div className='col-md-3'>
                                            <label className='d-block me-3 d-inline'>Cochera<span className="required-star"> *</span></label>
                                            <input
                                                type="radio"
                                                name="cochera"
                                                id="tienecochera"
                                                className='form-check-input' />
                                            <label htmlFor="si" className="me-3">
                                                Sí
                                            </label>
                                            <input
                                                type="radio"
                                                name="cochera"
                                                id="notienecochera"
                                                className='form-check-input' />
                                            <label htmlFor="no">
                                                No
                                            </label>
                                            {errors.cochera && <div className="text-danger">{errors.cochera}</div>}
                                        </div>

                                        <div className='col-md-3'>
                                            <label className='d-inline'>Habitaciones</label> <br />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm ms-2"
                                                onClick={() => handleRestar(setHabitaciones, habitaciones)}
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{habitaciones}</span>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleSumar(setHabitaciones, habitaciones)}
                                            >
                                                +
                                            </button>
                                            {errors.habitaciones && <div className="text-danger">{errors.habitaciones}</div>}
                                        </div>

                                        <div className='col-md-3'>
                                            <label>Ambientes </label> <br />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm ms-2"
                                                onClick={() => handleRestarBase(setAmbientes, ambientes)}
                                            >
                                                -
                                            </button>
                                            <span className='mx-2'>{ambientes}</span>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleSumar(setAmbientes, ambientes)}
                                            >
                                                +
                                            </button>
                                            {errors.ambientes && <div className="text-danger">{errors.ambientes}</div>}
                                        </div>

                                        <div className='col-md-3'>
                                            <label className='d-inline'>Baños</label> <br />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm ms-2"
                                                onClick={() => handleRestarBase(setBanios, banios)}
                                            >
                                                -
                                            </button>
                                            <span className='mx-2'>{banios}</span>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleSumar(setBanios, banios)}
                                            >
                                                +
                                            </button>
                                            {errors.banios && <div className="text-danger">{errors.banios}</div>}
                                        </div>

                                    </div>

                                    <div className='row mb-3'>
                                        <div className='col-md-6'>
                                            <label>Superficie(mts<sup>2</sup>): </label>
                                            <input
                                                type="text"
                                                name="superficie"
                                                id="superficie"
                                                className={`form-control ${errors.superficie ? "is-invalid" : ""}`}
                                                value={superficie}
                                                onChange={(e) => {
                                                    setSuperficie(e.target.value);
                                                    if (e.target.value && (isNaN(e.target.value) || parseFloat(e.target.value) <= 0)) {
                                                        setErrors(prev => ({ ...prev, superficie: "Ingrese un número válido" }));
                                                    } else {
                                                        setErrors(prev => {
                                                            const { superficie, ...rest } = prev;
                                                            return rest;
                                                        });
                                                    }
                                                }}
                                            />
                                            {errors.superficie && <div className="invalid-feedback">{errors.superficie}</div>}
                                        </div>
                                        <div className='col-md-6'>
                                            <label>Antigüedad(años): </label>
                                            <input
                                                type="text"
                                                name="antiguedad"
                                                id="antiguedad"
                                                className={`form-control ${errors.antiguedad ? "is-invalid" : ""}`}
                                                value={antiguedad}
                                                onChange={(e) => {
                                                    setAntiguedad(e.target.value);
                                                    if (e.target.value && (isNaN(e.target.value) || parseFloat(e.target.value) < 0)) {
                                                        setErrors(prev => ({ ...prev, antiguedad: "Ingrese un número válido" }));
                                                    } else {
                                                        setErrors(prev => {
                                                            const { antiguedad, ...rest } = prev;
                                                            return rest;
                                                        });
                                                    }
                                                }}
                                            />
                                            {errors.antiguedad && <div className="text-danger">{errors.antiguedad}</div>}
                                        </div>
                                    </div>

                                    <div className='row mb-3'>
                                        <div className='col-md-6'>
                                            <label className='d-inline'>Precio Alquiler<span className="required-star"> *</span></label>
                                            <input
                                                type="text"
                                                name="precioAlquiler"
                                                id="precioAlquiler"
                                                className={`form-control ${errors.precioAlquiler ? "is-invalid" : ""}`}
                                                value={precioAlquiler}
                                                onChange={(e) => {
                                                    setPrecioAlquiler(e.target.value);
                                                    if (e.target.value && (isNaN(e.target.value) || parseFloat(e.target.value) <= 0)) {
                                                        setErrors(prev => ({ ...prev, precioAlquiler: "Ingrese un número válido" }));
                                                    } else {
                                                        setErrors(prev => {
                                                            const { precioAlquiler, ...rest } = prev;
                                                            return rest;
                                                        });
                                                    }
                                                }}
                                            />
                                            {errors.precioAlquiler && <div className="text-danger">{errors.precioAlquiler}</div>}
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='d-inline'>Precio Expensas<span className="required-star"> *</span></label>
                                            <input
                                                type="text"
                                                name="precioExpensas"
                                                id="precioExpensas"
                                                className={`form-control ${errors.precioExpensas ? "is-invalid" : ""}`}
                                                value={precioExpensas}
                                                onChange={(e) => {
                                                    setPrecioExpensas(e.target.value);
                                                    if (e.target.value && (isNaN(e.target.value) || parseFloat(e.target.value) <= 0)) {
                                                        setErrors(prev => ({ ...prev, precioExpensas: "Ingrese un número válido" }));
                                                    } else {
                                                        setErrors(prev => {
                                                            const { precioExpensas, ...rest } = prev;
                                                            return rest;
                                                        });
                                                    }
                                                }}
                                            />
                                            {errors.precioExpensas && <div className="text-danger">{errors.precioExpensas}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label>Más Información:</label>
                                    <textarea name="masinformacion" id="masinformacion" rows="8" cols="50" maxLength={300} placeholder='Ingrese los datos que crea importantes sobre el inmueble...' className='form-control' />
                                </div> <br />

                                <div className='d-flex justify-content-center gap-3 mt-2'>
                                    <button type="button" className="btn btn-secondary w-25" onClick={() => navigate("/add-property/location")}>
                                        Volver
                                    </button>
                                    <button type="button" className="btn btn-primary w-25" onClick={handleSubmit}>
                                        Continuar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PropertyFeatures
