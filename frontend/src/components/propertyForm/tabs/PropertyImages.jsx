import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faVideo,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import { toastError, toastSuccess } from "../../ui/toaster/Notifications";
import Notifications from "../../ui/toaster/Notifications";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../customStyles/PropertyImages.css";

import { PropertyContext } from "../../../services/property.context";
import PropertyServices from "../../../services/propertyServices.js";
import { AuthenticationContext } from "../../../services/auth.context.jsx";

const PropertyImages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const locationData = JSON.parse(localStorage.getItem("propertyLocationData"));
    const featuresData = JSON.parse(localStorage.getItem("propertyFeaturesData"));
    if (!locationData) {
      navigate("/add-property/location");
    } else if (!featuresData) {
      navigate("/add-property/features");
    }
  }, [navigate]); 

  const { updateSection, formData } = useContext(PropertyContext);
  const { token } = useContext(AuthenticationContext);

  const [data, setData] = useState({
    videoUrl: "",
    images: [],
    documents: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoChange = (e) => {
    const url = e.target.value.trim();

    // Validar solo si hay algo escrito
    if (url && !url.includes("youtube.com") && !url.includes("youtu.be")) {
      setErrors((prev) => ({
        ...prev,
        video: "Por favor, ingresa un enlace de YouTube válido",
      }));
    } else {
      setErrors((prev) => {
        const { video, ...rest } = prev;
        return rest;
      });
    }

    handleChange("videoUrl", url);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toastError("Solo podés subir hasta 10 imágenes");
      e.target.value = null;
      return;
    }
    handleChange("images", files);
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toastError("Solo podés subir hasta 5 archivos");
      e.target.value = null;
      return;
    }
    handleChange("documents", files);
  };

  const handleValidation = () => {
    const newErrors = {};

    // Solo validar el video si está vacío o mal escrito
    if (
      data.videoUrl &&
      !data.videoUrl.includes("youtube.com") &&
      !data.videoUrl.includes("youtu.be")
    ) {
      newErrors.video = "Por favor, ingresa un enlace de YouTube válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = async () => {
    if (handleValidation()) {

      // img
      const uploadedImages = await Promise.all(
        data.images.map((img) => PropertyServices.uploadFile(img, token))
      );

      // docs
      const uploadedDocs = await Promise.all(
        data.documents.map((doc) => PropertyServices.uploadFile(doc, token))
      );

      const updatedData = {
        ...data,
        images: uploadedImages,
        documents: uploadedDocs,
      };

      localStorage.setItem("propertyImagesData", JSON.stringify(updatedData))
      
      updateSection("images", updatedData);

      toastSuccess("Datos guardados correctamente");
      navigate('/add-property/preview');
    } else {
      toastError("Por favor, revisá los campos con error.");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="property-step fade-in">
      <Notifications />
      {/* BLOQUE 1 - Subida de imágenes */}
      <div className="form-section">
        <label className="form-label">
          <FontAwesomeIcon icon={faCamera} className="me-2 text-success" />
          Subí las mejores fotos de tu propiedad
          <span className="required-star"> *</span>
        </label>
        <small className="text-muted d-block mb-2">(Hasta 10 imágenes)</small>
        <input
          type="file"
          name="fotos"
          id="fotos"
          className="form-control"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />

        {data.images.length > 0 && (
          <div className="d-flex justify-content-center mt-3">
            <div style={{ width: "85%", maxWidth: "350px" }}>
              <Slider {...sliderSettings}>
                {data.images.map((img, index) => (
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
        )}
      </div>

      {/* BLOQUE 2 - Video */}
      <div className="form-section mt-4">
        <label className="form-label">
          <FontAwesomeIcon icon={faVideo} className="me-2 text-success" />
          Agregá un video de la propiedad
        </label>
        <input
          type="url"
          name="video"
          id="video"
          className={`form-control ${errors.video ? "is-invalid" : ""}`}
          placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
          value={data.videoUrl}
          onChange={handleVideoChange}
        />
        {errors.video && <div className="invalid-feedback d-block">{errors.video}</div>}

        {data.videoUrl && !errors.video && (
          <div className="preview-video mt-3">
            <iframe
              width="100%"
              height="200"
              src={data.videoUrl.replace("watch?v=", "embed/")}
              title="Video de la propiedad"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      {/* BLOQUE 3 - Documentación */}
      <div className="form-section mt-4">
        <label className="form-label">
          <FontAwesomeIcon
            icon={faFileSignature}
            className="me-2 text-success"
          />
          Documentación / Escritura de la propiedad
          <span className="required-star"> *</span>
        </label>

        <small className="text-muted d-block mb-2">
          (Podés subir varios archivos — PDF o imágenes)
        </small>
        <input
          type="file"
          name="documentacion"
          id="documentacion"
          accept=".pdf, image/*"
          multiple
          className="form-control"
          onChange={handleDocumentsChange}
        />

        {/* Vista previa del documento */}
        {data.documents.length > 0 && (
          <div className="doc-preview-multiple mt-3">
            <div className="doc-preview-slider mt-3">
              <Slider {...sliderSettings}>
                {data.documents.map((file, index) => (
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
      </div>

      {/* BOTONES */}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button
          type="button"
          className="btn btn-secondary w-25"
          onClick={() => navigate("/add-property/features")}
        >
          Volver
        </button>
        <button
          type="button"
          className="btn btn-primary w-25"
          onClick={handlePreview}
        >
          Vista previa
        </button>
      </div>
    </div>
  );
};

export default PropertyImages;
