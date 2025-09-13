import React from "react";
import LOGO from "/logo/techo-amarillo-blanco.webp";
import "../../customStyle.css";

import { Link } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="mt-5 pt-4 border-top bg-primary">
      <div className="row text-center">
        <div className="col-md-4 mb-3">
          <img
            src={LOGO}
            alt="LOGO Alquilar"
            className="logo-alquilAR"
            style={{ width: "200px", height: "auto" }}
          />
        </div>

        <div className="col-md-4 mb-3">
          <p className="fw-bold">Redes Sociales</p>
          <div className="d-flex justify-content-center gap-4 social-links">
            <Link
              to="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark fs-3"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
            <Link
              to="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark fs-3"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
            <Link
              to="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark fs-3"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <ul className="list-unstyled footer-terms-conditions">
            <li>
              <Link to="/">FAQ</Link>
            </li>
            <li>
              <Link to="/">Términos y Condiciones</Link>
            </li>
            <li>
              <Link to="/">Políticas de Privacidad</Link>
            </li>
            <li>
              <Link to="/">Contáctanos</Link>
            </li>
            <li>
              <Link to="/about-us">Sobre Nosotros</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
