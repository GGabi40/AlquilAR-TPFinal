import { React, useState } from 'react';
import PropertyTabs from './PropertyTabs';
import { useNavigate } from "react-router";
import PropertyImageDoc from "/illustrations/property-register/reg-prop-3.1.jpg";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      alert("Por favor, ingresa un enlace de YouTube válido.");
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setErrors(prev => ({ ...prev, images: "Solo podés subir hasta 10 imágenes" }));
      e.target.value = null;
      return;
    }
    setImages(files);
    if (files.length > 0) {
      setErrors(prev => {
        const { images, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleValidation = () => {
    const newErrors = {};
    if (images.length === 0) newErrors.images = "Debes subir al menos una imagen";
    if (!document) newErrors.document = "Debes subir un documento de la propiedad";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (handleValidation()) {
      navigate('/property/preview');
    } else {
      alert("Por favor completa los campos obligatorios antes de continuar.");
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
    <div className="container my-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={PropertyImageDoc}
            alt="Ilustración de registro de imágenes y documentación de la propiedad en AlquilAR"
            className="illustration-login img-fluid d-none d-md-block"
          />

          <h2 className="d-block d-md-none text-center fw-bold mt-3">
            AlquilAR tu hogar
          </h2>
        </div>


        <div className='col-md-6 d-flex justify-content-center align-items-center  login-form'>
          <div className='card shadow h-100'>
            <div className='card-body d-flex flex-column justify-content-center text-dark'>
              <h2 className='card-title text-center mb-4'>Registro de tu Propiedad</h2>
              <PropertyTabs />
              <label className='form-label d-block'>Subí las mejores fotos de tu propiedad<span className="required-star"> *</span> <br />(Hasta 10)</label>
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

              <div className="d-flex justify-content-center mt-3">
                <div style={{ width: '80%', maxWidth: '300px' }}>
                  <Slider {...sliderSettings}>
                    {images.map((img, index) => (
                      <div key={index}>
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${index}`}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              <br />
              <label className='form-label d-block'>Subí un vídeo de la propiedad</label>
              <input
                type="url"
                name="video"
                id="video"
                className="form-control"
                placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                value={videoUrl}
                onChange={handleVideoChange}
              />
              {videoUrl && (
                <div className="preview-video mt-2">
                  <iframe
                    width="220"
                    height="100"
                    src={videoUrl.replace("watch?v=", "embed/")}
                    title="Video de la propiedad"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <br />
              <label className='form-label d-block'>Documentación/Escritura de la propiedad<span className="required-star"> *</span></label>
              <input
                type="file"
                name='documentacion'
                id="documentacion"
                className={`form-control ${errors.document ? "is-invalid" : ""}`}
                onChange={(e) => setDocument(e.target.files[0])}
              />
              {errors.document && <div className="text-danger">{errors.document}</div>}
              {document && (
                <p className="mt-2">Archivo seleccionado: {document.name}</p>
              )}
              <br />

              <div className='d-flex justify-content-center gap-3 mt-2'>
                <button type="button" className='btn btn-secondary' onClick={() => navigate('/add-property/features')}>Anterior</button>
                <button type="button" className='btn btn-primary' onClick={handlePreview}>Vista Previa</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>)
}

export default PropertyImages;
