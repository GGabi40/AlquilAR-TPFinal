import { React, useState } from 'react';
import { useNavigate } from "react-router";


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
        <div>
            <label className="form-label">Elija su propiedad:</label>

            <div className="form-check">
                <input
                    type="radio"
                    name="tipoPropiedad"
                    id="casa"
                    className="form-check-input"
                />
                <label className="form-check-label" htmlFor="casa">
                    Casa
                </label>
            </div>

            <div className="form-check">
                <input
                    type="radio"
                    name="tipoPropiedad"
                    id="departamento"
                    className="form-check-input"
                />
                <label className="form-check-label" htmlFor="departamento">
                    Departamento
                </label>
            </div>

            <div className="form-check">
                <label>¿Tiene cochera?:</label>
                <input type="radio" name="tienecochera" id="tienecochera" />
                <label>Sí</label>
                <input type="radio" name="notienecochera" id="notienecochera" />
                <label>No</label>
            </div>

            <div className='form-check'>
                <label>¿Cómo te gustaría alquilar?:</label>
                <input type='checkbox' name="alquilercompleto" id="alquilercompleto" />
                <label>Alquiler completo</label>
                <input type='checkbox' name="alquilertemporario" id="alquilertemporario" />
                <label>Alquiler temporario</label>
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

            <button type="button" className='btn-outline-primary' onClick={() => navigate("/propertyImages")}>
                Continuar
            </button>

        </div>
    )
}

export default PropertyFeatures
