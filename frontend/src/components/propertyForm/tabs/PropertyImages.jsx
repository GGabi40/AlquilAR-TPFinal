import React, { useState } from "react";
import { useNavigate } from "react-router";
import PropertyTabs from "./PropertyTabs";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faVideo,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../customStyles/PropertyImages.css";

const PropertyImages = () => {
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState("");
  const [images, setImages] = useState([]);
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});

  const handleVideoChange = (e) => {
    const url = e.target.value;
    if (url === "" || url.includes("youtube.com") || url.includes("youtu.be")) {
      setVideoUrl(url);
    } else {
      setErrors((prev) => ({
        ...prev,
        video: "Por favor, ingresa un enlace de YouTube válido",
      }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setErrors((prev) => ({
        ...prev,
        images: "Solo podés subir hasta 10 imágenes",
      }));
      e.target.value = null;
      return;
    }
    setImages(files);
    setErrors((prev) => {
      const { images, ...rest } = prev;
      return rest;
    });
  };

  const handleValidation = () => {
    const newErrors = {};
    if (images.length === 0)
      newErrors.images = "Debés subir al menos una imagen";
    if (!document)
      newErrors.document = "Debés subir un documento de la propiedad";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (handleValidation()) {
      navigate("/property/preview");
    } else {
      alert("Por favor completá los campos obligatorios antes de continuar.");
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
          className={`form-control ${errors.images ? "is-invalid" : ""}`}
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />
        {errors.images && <div className="text-danger">{errors.images}</div>}

        {images.length > 0 && (
          <div className="d-flex justify-content-center mt-3">
            <div style={{ width: "85%", maxWidth: "350px" }}>
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
          value={videoUrl}
          onChange={handleVideoChange}
        />
        {errors.video && <div className="text-danger">{errors.video}</div>}

        {videoUrl && (
          <div className="preview-video mt-3">
            <iframe
              width="100%"
              height="200"
              src={videoUrl.replace("watch?v=", "embed/")}
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
          className={`form-control ${errors.document ? "is-invalid" : ""}`}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 5) {
              setErrors((prev) => ({
                ...prev,
                documents: "Solo podés subir hasta 5 archivos",
              }));
              e.target.value = null;
              return;
            }
            setErrors((prev) => {
              const { documents, ...rest } = prev;
              return rest;
            });
            setDocument(files);
          }}
        />
        {errors.document && (
          <div className="text-danger">{errors.document}</div>
        )}

        {/* Vista previa del documento */}
        {document && document.length > 0 && (
          <div className="doc-preview-multiple mt-3">
            {document && document.length > 0 && (
              <div className="doc-preview-slider mt-3">
                <Slider {...sliderSettings}>
                  {document.map((file, index) => (
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
            )}
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
