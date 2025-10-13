import React from "react";
import { ErrorLayout } from "../ErrorLayout";
import imageUnauthorized from "/illustrations/errorPage/unauthorized.webp";

const Unauthorized = () => (
  <ErrorLayout
    title="Acceso no autorizado"
    message="No tienes permiso para acceder a esta sección."
    image={imageUnauthorized}
  />
);

export default Unauthorized;
