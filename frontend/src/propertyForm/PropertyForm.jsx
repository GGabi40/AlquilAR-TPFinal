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
        <div> <h1>propiedad</h1>
            <a className="navbar-brand" href="#">
                Navbar
            </a>

            <div className='form-control'>
                <h2>Registra tu Propiedad</h2>

                <label>Provincia:</label>
                <input
                    type="text"
                    placeholder='Ingrese su Provincia'
                    value={provincia}
                    onChange={handleProvinciaChange}
                />

                <label>Localidad:</label>
                <input
                    type="text"
                    placeholder='Ingrese su Localidad/Ciudad'
                    value={localidad}
                    onChange={handleLocalidadChange}
                />

                <label>Barrio:</label>
                <input
                    type="text"
                    placeholder='Ingrese el Barrio de la Propiedad'
                    value={barrio}
                    onChange={handleBarrioChange}
                />

                <label>Dirección:</label>
                <input
                    type="text"
                    placeholder='Dirección de la Propiedad'
                    value={direccion}
                    onChange={handleDireccionChange}
                />

                <button type="button" className='btn-outline-primary'>
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default PropertyForm;


