import React, { useEffect } from "react";
import { Container, Card } from "react-bootstrap";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Container className="py-5">
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h2 className="mb-4 text-center">Política de Privacidad y Seguridad</h2>

          <p>
            En <strong>AlquilAR</strong>, la privacidad y seguridad de nuestros usuarios es nuestra prioridad. Esta política describe cómo recopilamos, usamos y protegemos la información.
          </p>

          <h5 className="mt-4">1. Información que recopilamos</h5>
          <p>
            Recopilamos información personal que los usuarios proporcionan al registrarse, como nombre, correo electrónico, teléfono y datos de propiedades. También podemos recopilar datos de uso de la plataforma para mejorar la experiencia.
          </p>

          <h5 className="mt-4">2. Uso de la información</h5>
          <p>
            La información se utiliza únicamente para ofrecer los servicios de AlquilAR, contactar a los usuarios cuando sea necesario, y mejorar la plataforma.
          </p>

          <h5 className="mt-4">3. Protección de datos</h5>
          <p>
            Implementamos medidas técnicas y administrativas para proteger los datos de los usuarios contra accesos no autorizados, pérdida o alteración. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
          </p>

          <h5 className="mt-4">4. Compartir información</h5>
          <p>
            No vendemos ni compartimos la información personal de los usuarios con terceros, excepto cuando sea necesario para cumplir obligaciones legales o para prestar servicios dentro de la plataforma.
          </p>

          <h5 className="mt-4">5. Cookies y tecnologías similares</h5>
          <p>
            Podemos usar cookies y tecnologías similares para mejorar la experiencia de usuario y analizar el uso de la plataforma.
          </p>

          <h5 className="mt-4">6. Derechos de los usuarios</h5>
          <p>
            Los usuarios pueden solicitar acceso, corrección o eliminación de sus datos personales en cualquier momento contactándonos a través de nuestro formulario de contacto.
          </p>

          <h5 className="mt-4">7. Cambios en la política</h5>
          <p>
            AlquilAR se reserva el derecho de modificar esta política en cualquier momento. Recomendamos revisar periódicamente esta sección para estar al tanto de cualquier actualización.
          </p>

          <p className="mt-4 text-muted">
            Fecha de última actualización: Septiembre 2025
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;