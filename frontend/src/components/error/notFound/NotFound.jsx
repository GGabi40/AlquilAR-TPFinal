import React from "react";
import { ErrorLayout } from "../ErrorLayout";
import imageNotFound from "/illustrations/errorPage/notFound.webp";

const NotFound = () => (
  <ErrorLayout
    title="Página no encontrada"
    message="Lo sentimos, la página que buscas no existe."
    image={imageNotFound}
  />
);

export default NotFound;
