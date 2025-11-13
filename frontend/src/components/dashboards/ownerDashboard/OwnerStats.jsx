import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave, faReceipt } from "@fortawesome/free-solid-svg-icons";

import '../../../customStyle.css';

export default function OwnerStats({ posts, show }) {
 if (!show) return null;

  const ingresos = posts
    .filter((p) => p.status === "rented")
    .reduce((acc, p) => acc + (p.Property?.rentPrice || 0), 0);

  const gastos = posts
    .filter((p) => p.status !== "rented")
    .reduce((acc, p) => acc + (p.Property?.expensesPrice || 0), 0);

  return (
    <Card className="shadow-sm p-4 mb-4 rounded-4 fade-in" style={{ opacity: 0, fontSize: '13px' }}>
      <h4 className="fw-bold mb-4 text-center">Tus estadísticas</h4>
      <hr />

      <Row>
        {/* INGRESOS */}
        <Col md={6} className="mb-3">
          <Card className="p-3 border-0 shadow-sm rounded-4 text-center">
            <FontAwesomeIcon
              icon={faMoneyBillWave}
              size="2x"
              className="text-success mb-2"
            />
            <h5 className="fw-semibold">Ingresos por alquileres</h5>
            <p className="display-6 fw-bold text-success">
              ${ingresos.toLocaleString()}
            </p>
          </Card>
        </Col>

        {/* GASTOS */}
        <Col md={6} className="mb-3">
          <Card className="p-3 border-0 shadow-sm rounded-4 text-center">
            <FontAwesomeIcon
              icon={faReceipt}
              size="2x"
              className="text-danger mb-2"
            />
            <h5 className="fw-semibold">Gastos por expensas</h5>
            <p className="display-6 fw-bold text-danger">
              ${gastos.toLocaleString()}
            </p>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
