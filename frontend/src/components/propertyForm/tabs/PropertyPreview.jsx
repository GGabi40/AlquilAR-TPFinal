import React, { useContext } from "react";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import { PropertyContext } from "../../../services/property.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCity,
  faHome,
  faRulerCombined,
  faClockRotateLeft,
  faMoneyBillWave,
  faReceipt,
  faVideo,
  faFileSignature,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../customStyles/PropertyPreview.css";

import { toastSuccess,toastError } from "../../ui/toaster/Notifications";
import Notifications from "../../ui/toaster/Notifications";

const PropertyPreview = () => {
  const { formData } = useContext(PropertyContext);
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const { location = {}, features = {}, images = [] } = formData;

  /* ACÁ SE HARÁ UN POST */
  
  return (
    <div className="property-step fade-in">
      <Notifications />

      <h3 className="step-title text-center mb-4">Vista previa de la propiedad</h3>

      {/* BLOQUE 1 - IMÁGENES */}
      {images.length > 0 && (
        <div className="preview-section mb-4">
          <h5>
            <FontAwesomeIcon icon={faHome} className="me-2 text-primary" />
            Imágenes
          </h5>
          <div className="d-flex justify-content-center mt-3">
            <div style={{ width: "85%", maxWidth: "400px" }}>
              <Slider {...sliderSettings}>
                {images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${index}`}
                      className="preview-image"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      )}

      {/* BLOQUE 2 - UBICACIÓN */}
      <div className="preview-section">
        <h5>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
          Ubicación
        </h5>
        <ul className="list-unstyled ms-3">
          <li>
            <FontAwesomeIcon icon={faCity} className="me-2 text-secondary" />
            <strong>Provincia:</strong> {location.provincia || "No especificada"}
          </li>
          <li>
            <FontAwesomeIcon icon={faCity} className="me-2 text-secondary" />
            <strong>Localidad:</strong> {location.localidad || "No especificada"}
          </li>
          <li>
            <FontAwesomeIcon icon={faHome} className="me-2 text-secondary" />
            <strong>Barrio:</strong> {location.barrio || "No especificado"}
          </li>
          <li>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-secondary" />
            <strong>Dirección:</strong> {location.direccion || "No especificada"}
          </li>
        </ul>
      </div>

      {/* BLOQUE 3 - CARACTERÍSTICAS */}
      <div className="preview-section mt-4">
        <h5>
          <FontAwesomeIcon icon={faRulerCombined} className="me-2 text-primary" />
          Características
        </h5>
        <ul className="list-unstyled ms-3">
          <li>
            <strong>Tipo de propiedad:</strong>{" "}
            {features.tipoPropiedad || "No especificado"}
          </li>
          <li>
            <strong>Tipo de alquiler:</strong>{" "}
            {features.alquileres?.join(", ") || "No especificado"}
          </li>
          <li>
            <strong>Cochera:</strong> {features.cochera || "No especificado"}
          </li>
          <li>
            <strong>Habitaciones:</strong> {features.habitaciones ?? "-"}
          </li>
          <li>
            <strong>Ambientes:</strong> {features.ambientes ?? "-"}
          </li>
          <li>
            <strong>Baños:</strong> {features.banios ?? "-"}
          </li>
          <li>
            <FontAwesomeIcon icon={faRulerCombined} className="me-2 text-secondary" />
            <strong>Superficie:</strong>{" "}
            {features.superficie ? `${features.superficie} m²` : "-"}
          </li>
          <li>
            <FontAwesomeIcon icon={faClockRotateLeft} className="me-2 text-secondary" />
            <strong>Antigüedad:</strong>{" "}
            {features.antiguedad ? `${features.antiguedad} años` : "-"}
          </li>
          <li>
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2 text-secondary" />
            <strong>Precio alquiler:</strong>{" "}
            {features.precioAlquiler ? `$${features.precioAlquiler}` : "-"}
          </li>
          <li>
            <FontAwesomeIcon icon={faReceipt} className="me-2 text-secondary" />
            <strong>Expensas:</strong>{" "}
            {features.precioExpensas ? `$${features.precioExpensas}` : "-"}
          </li>
          {features.masInformacion && (
            <li className="mt-2">
              <FontAwesomeIcon icon={faCircleInfo} className="me-2 text-secondary" />
              <strong>Más información:</strong> {features.masInformacion}
            </li>
          )}
        </ul>
      </div>

      {/* BLOQUE 4 - VIDEO */}
      {images.videoUrl && (
        <div className="preview-section mt-4">
          <h5>
            <FontAwesomeIcon icon={faVideo} className="me-2 text-primary" />
            Video
          </h5>
          <div className="mt-3">
            <iframe
              width="100%"
              height="250"
              src={images.videoUrl.replace("watch?v=", "embed/")}
              title="Video de la propiedad"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* BLOQUE 5 - DOCUMENTOS */}
      {images.document && images.document.length > 0 && (
        <div className="preview-section mt-4">
          <h5>
            <FontAwesomeIcon icon={faFileSignature} className="me-2 text-primary" />
            Documentación
          </h5>
          <div className="doc-preview-slider mt-3">
            <Slider {...sliderSettings}>
              {images.document.map((file, index) => (
                <div key={index} className="doc-slide">
                  <p className="small text-muted mb-2 text-center">
                    <strong>{file.name}</strong>
                  </p>

                  {file.type.includes("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Documento ${index + 1}`}
                      className="doc-preview-img"
                    />
                  ) : file.type === "application/pdf" ? (
                    <iframe
                      src={URL.createObjectURL(file)}
                      title={`Documento PDF ${index + 1}`}
                      className="doc-preview-pdf"
                    ></iframe>
                  ) : (
                    <p className="text-secondary small text-center">
                      No se puede previsualizar este tipo de archivo.
                    </p>
                  )}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      {/* BOTONES */}
      <div className="d-flex justify-content-center gap-3 mt-5">
        <button
          type="button"
          className="btn btn-secondary w-25"
          onClick={() => navigate("/add-property/images")}
        >
          Volver
        </button>
        <button type="button" className="btn btn-success w-25">
          Publicar
        </button>
      </div>
    </div>
  );
};

export default PropertyPreview;
