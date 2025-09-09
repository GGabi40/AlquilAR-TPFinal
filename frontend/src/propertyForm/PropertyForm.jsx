import { use } from 'react';
import React, { useState } from 'react';
import { useNavigate } from "react-router";

//iniciando el formulario de registro de propiedad


const PropertyForm = () => {

    const navigate = useNavigate();

    const [provincia, setProvincia] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [barrio, setBarrio] = useState("");
    const [direccion, setDireccion] = useState("");

    const handleProvinciaChange = (e) => {
        setProvincia(e.target.value);
    }

    const handleLocalidadChange = (e) => {
        setLocalidad(e.target.value);
    }

    const handleBarrioChange = (e) => {
        setBarrio(e.target.value);
    }

    const handleDireccionChange = (e) => {
        setDireccion(e.target.value);
    }


    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10 d-flex justify-content-center align-items-center">

                    <div className=" register-form">
                        <div className="card shadow h-100">
                            <div className="card-body d-flex flex-column justify-content-center text-dark">
                                <h2 className="card-title text-center mb-4">Registra tu Propiedad</h2>

                                <div className="mb-3">
                                    <label className="form-label">Provincia:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        placeholder='Ingrese su Provincia'
                                        value={provincia}
                                        onChange={handleProvinciaChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Localidad:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        placeholder='Ingrese su Localidad/Ciudad'
                                        value={localidad}
                                        onChange={handleLocalidadChange}
                                    />
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Barrio:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        placeholder='Ingrese el Barrio de la Propiedad'
                                        value={barrio}
                                        onChange={handleBarrioChange}
                                    />
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Dirección:</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        placeholder='Dirección de la Propiedad'
                                        value={direccion}
                                        onChange={handleDireccionChange}
                                    />
                                </div>


                                <div className="d-flex justify-content-center">
                                    <button type="button" className="btn btn-primary w-50" onClick={() => navigate("/property-features")}>
                                        Continuar
                                    </button>
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


