import React, { useState } from 'react';
import { useNavigate } from "react-router";
import PropertyImageFeatures from "/illustrations/property-register/reg-prop-2.1.jpg";


const PropertyFeatures = () => {

    const navigate = useNavigate();

    const [habitaciones, setHabitaciones] = useState(0);
    const [ambientes, setAmbientes] = useState(1);
    const [banios, setBanios] = useState(1);


    const handleSumar = (setter, valor) => setter(valor + 1);
    const handleRestar = (setter, valor) => {
        if (valor > 0) setter(valor - 1);
    };

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
                                    <h2 className='card-title text-center mb-4'>Características de la Propiedad</h2>
                                    <label className="form-label d-block">Elija su propiedad:</label>

                                    <div className='row mb-3'>
                                        <div className='col-md-10'>
                                            <div>
                                                <input
                                                    type="radio"
                                                    name="tipoPropiedad"
                                                    id="casa"
                                                    className="form-check-input me-1"
                                                />
                                                <label htmlFor="casa">
                                                    Casa
                                                </label>
                                                <input
                                                    type="radio"
                                                    name="tipoPropiedad"
                                                    id="departamento"
                                                    className="form-check-input me-1"
                                                />
                                                <label htmlFor="departamento">
                                                    Departamento
                                                </label>
                                            </div>
                                        </div>

                                        <label className="form-label d-block">¿Cómo te gustaría alquilar?:</label>
                                        <div className='col-md-10'>
                                            <div>
                                                <input
                                                    type='checkbox'
                                                    name="alquiler"
                                                    id="alquilercompleto"
                                                    className='form-check-label me-1'/>
                                                <label htmlFor="alquilercompleto" className="me-3">Alquiler completo</label>
                                                <input
                                                    type='checkbox'
                                                    name="alquiler"
                                                    id="alquilertemporario"
                                                    className='form-check-label me-1'/>
                                                <label htmlFor="alquilertemporario">Alquiler temporario</label>
                                            </div>
                                        </div>
                                    </div>

                                    <label>¿Tiene cochera?:</label>
                                    <div className="mb-3">
                                        <input
                                            type="radio"
                                            name="cochera"
                                            id="tienecochera"
                                            className='form-check-label' />
                                        <label className="form-check-label" htmlFor="si">
                                            Sí
                                        </label>
                                        <input
                                            type="radio"
                                            name="cochera"
                                            id="notienecochera"
                                            className='form-check-label' />
                                        <label className="form-check-label" htmlFor="no">
                                            No
                                        </label>
                                    </div>





                                    <div>
                                        <label>Habitaciones:</label>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={() => handleRestar(setHabitaciones, habitaciones)}
                                        >
                                            -
                                        </button>
                                        <span>{habitaciones}</span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ms-2"
                                            onClick={() => handleSumar(setHabitaciones, habitaciones)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div>
                                        <label>Ambientes:</label>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={() => handleRestar(setAmbientes, ambientes)}
                                        >
                                            -
                                        </button>
                                        <span>{ambientes}</span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ms-2"
                                            onClick={() => handleSumar(setAmbientes, ambientes)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div>
                                        <label>Baños:</label>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={() => handleRestar(setBanios, banios)}
                                        >
                                            -
                                        </button>
                                        <span>{banios}</span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ms-2"
                                            onClick={() => handleSumar(setBanios, banios)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div>
                                        <label>Superficie: (mts<sup>2</sup>)</label>
                                        <input type="number" name="superficie" id="superficie" />
                                    </div>

                                    <div>
                                        <label>Antiguedad: (años)</label>
                                        <input type="number" name="antiguedad" id="antiguedad" />
                                    </div>

                                    <div>
                                        <label>Precio Alquiler:</label>
                                        <input type="number" name="precioalquiler" id="precioalquiler" />
                                    </div>

                                    <div>
                                        <label>Precio Expensas:</label>
                                        <input type="number" name="precioexpensas" id="precioexpensas" />
                                    </div>

                                    <div>
                                        <label>Más Información:</label>
                                        <textarea name="masinformacion" id="masinformacion" rows="8" cols="50" maxLength={300} placeholder='Ingrese los datos que crea importantes sobre el inmueble...' />
                                    </div>

                                    <button type="button" className="btn btn-secondary w-50" onClick={() => navigate("/add-property")}>
                                        Volver
                                    </button>
                                    <button type="button" className="btn btn-primary w-50" onClick={() => navigate("/propertyImages")}>
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
