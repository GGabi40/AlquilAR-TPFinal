import React, { useState } from 'react';
import { useNavigate } from "react-router";
import PropertyImageFeatures from "/illustrations/property-register/reg-prop-2.1.jpg";
import PropertyTabs from './PropertyTabs';

const PropertyFeatures = () => {

    const navigate = useNavigate();

    const [habitaciones, setHabitaciones] = useState(0);
    const [ambientes, setAmbientes] = useState(1);
    const [banios, setBanios] = useState(1);


    const handleSumar = (setter, valor) => setter(valor + 1);
    const handleRestar = (setter, valor) => {
        if (valor > 0) setter(valor - 1);
    };
    const handleRestarBase = (setter, valor) => {
        if (valor > 1) setter(valor - 1);
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
                                    <h2 className='card-title text-center mb-4'>Registro de tu Propiedad</h2>
                                    <PropertyTabs />
                                    


                                    <div className='row mb-3'>
                                        <div className='col-md-6'>
                                            <div>
                                                <label className="form-label d-block">Elija su propiedad:</label>
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
                                            </div>
                                        </div>
                                        <br />

                                        <div className='col-md-6'>
                                            <label className="form-label d-block">¿Cómo te gustaría alquilar?:</label>
                                            <div>
                                                <input
                                                    type='checkbox'
                                                    name="alquiler"
                                                    id="alquilercompleto"
                                                    className='form-check-label' />
                                                <label htmlFor="alquilercompleto" className="me-3">Alquiler completo</label>
                                                <br />
                                                <input
                                                    type='checkbox'
                                                    name="alquiler"
                                                    id="alquilertemporario"
                                                    className='form-check-label' />
                                                <label htmlFor="alquilertemporario">Alquiler temporario</label>
                                            </div>
                                        </div>
                                        <br />

                                    </div>

                                    <div className='row mb-3'>
                                        <div className='col-md-3'>
                                            <label className='d-block me-3'>Cochera:</label>
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
                                        </div>

                                        <div className='col-md-3'>
                                            <label>Habitaciones:</label> <br />
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
                                        </div>

                                        <div className='col-md-3'>
                                            <label>Ambientes:</label> <br />
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
                                        </div>

                                        <div className='col-md-3'>
                                            <label>Baños:</label> <br />
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
                                        </div>

                                    </div>

                                    <div className='row mb-3'>
                                        <div className='col-md-6'>
                                            <label>Superficie(mts<sup>2</sup>): </label>
                                            <input type="number" name="superficie" id="superficie" className='form-control' />
                                        </div>
                                        <div className='col-md-6'>
                                            <label>Antigüedad(años): </label>
                                            <input type="number" name="antiguedad" id="antiguedad" className='form-control' />
                                        </div>
                                    </div>

                                    <div className='row mb-3'>
                                        <div className='col-md-6'>
                                            <label>Precio Alquiler:</label>
                                            <input type="number" name="precioalquiler" id="precioalquiler" className='form-control' />
                                        </div>
                                        <div className='col-md-6'>
                                            <label>Precio Expensas:</label>
                                            <input type="number" name="precioexpensas" id="precioexpensas" className='form-control' />
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
                                        <button type="button" className="btn btn-primary w-25" onClick={() => navigate("/add-property/images")}>
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
    )
}

export default PropertyFeatures
