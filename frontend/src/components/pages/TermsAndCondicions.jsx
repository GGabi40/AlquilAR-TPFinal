import React, { useEffect } from "react";
import { Container, Card } from "react-bootstrap";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Container className="py-5">
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h2 className="mb-4 text-center">Términos y Condiciones de AlquilAR</h2>

          <p>
            Bienvenido a <strong>AlquilAR</strong>. Al utilizar nuestra plataforma, aceptas cumplir con estos términos y condiciones.
          </p>

          <h5 className="mt-4">1. Uso de la Plataforma</h5>
          <p>
            AlquilAR es una plataforma que conecta propietarios e inquilinos. Su uso es únicamente para fines legales y personales relacionados con alquiler de propiedades.
          </p>

          <h5 className="mt-4">2. Registro de Usuarios</h5>
          <p>
            Todos los usuarios deben registrarse con información verdadera y actualizada. La responsabilidad de mantener la seguridad de tu cuenta es exclusivamente tuya.
          </p>

          <h5 className="mt-4">3. Responsabilidad del Contenido</h5>
          <p>
            Los propietarios son responsables de la veracidad de la información y fotografías de sus propiedades. AlquilAR no se hace responsable por errores, omisiones o contenido inapropiado publicado por los usuarios.
          </p>

          <h5 className="mt-4">4. Propiedad Intelectual</h5>
          <p>
            Todos los derechos de propiedad intelectual de la plataforma y su contenido son propiedad de AlquilAR o de sus licenciantes. No se permite la reproducción sin autorización.
          </p>

          <h5 className="mt-4">5. Privacidad y Protección de Datos</h5>
          <p>
            El uso de la plataforma está sujeto a nuestra <strong>Política de Privacidad</strong>. Al registrar tus datos aceptas cómo los manejamos.
          </p>

          <h5 className="mt-4">6. Modificaciones de los Términos</h5>
          <p>
            AlquilAR puede modificar estos términos en cualquier momento. Las modificaciones serán efectivas al publicarse en la plataforma. Recomendamos revisar periódicamente los términos actualizados.
          </p>

          <h5 className="mt-4">7. Terminación de Cuenta</h5>
          <p>
            AlquilAR se reserva el derecho de suspender o eliminar cuentas que violen estos términos o la ley aplicable, sin previo aviso.
          </p>

          <h5 className="mt-4">8. Legislación Aplicable</h5>
          <p>
            Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta en los tribunales competentes.
          </p>

          <p className="mt-4 text-muted">
            Fecha de última actualización: Septiembre 2025
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TermsAndConditions;