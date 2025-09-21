import React, { useEffect } from "react";
import { Container, Accordion, Card } from "react-bootstrap";

const FAQ = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const faqs = [
    {
      pregunta: "¿Cómo me registro en AlquilAR?",
      respuesta: "Hacé click en 'Registrarse', completá tus datos personales y confirmá tu correo electrónico para activar tu cuenta.",
    },
    {
      pregunta: "¿Puedo publicar más de una propiedad?",
      respuesta: "Sí, los usuarios pueden publicar múltiples propiedades y administrarlas desde su panel de control.",
    },
    {
      pregunta: "¿Cómo contacto a un propietario o inquilino?",
      respuesta: "Podés contactarte completando el formulario de contacto en la página de la propiedad. El propietario recibirá tus datos y podrá comunicarse con vos directamente.",
    },
    {
      pregunta: "¿Hay algún costo por usar la plataforma?",
      respuesta: "AlquilAR es gratuito para usuarios que buscan propiedades y para publicar hasta un sin límite de propiedades. Se pueden aplicar servicios premium en el futuro.",
    },
    {
      pregunta: "¿Qué hago si olvidé mi contraseña?",
      respuesta: "Hacé click en 'Olvidé mi contraseña' en la pantalla de login y seguí los pasos para recuperarla.",
    },
  ];

  return (
    <Container className="py-5">
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h2 className="mb-4 text-center">Preguntas Frecuentes (FAQ)</h2>

          <Accordion defaultActiveKey="0">
            {faqs.map((faq, idx) => (
              <Accordion.Item eventKey={idx.toString()} key={idx}>
                <Accordion.Header>{faq.pregunta}</Accordion.Header>
                <Accordion.Body>{faq.respuesta}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FAQ;