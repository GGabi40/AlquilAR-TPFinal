import React, { useState, useContext } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import Notifications from "../../ui/toaster/Notifications.jsx";
import { AuthenticationContext } from "../../../services/auth.context";

import UserTable from "./UserTable/UserTable.jsx";
import PropertyTable from "./propertyTable/PropertyTable.jsx";
import RequestApprovalTable from "./requestApprovalTable/RequestApprovelTable.jsx";

export default function SuperadminDashboard() {
  const { token, userId } = useContext(AuthenticationContext);
  const [key, setKey] = useState("users");

  return (
    <Container className="mt-4">
      <Notifications />
      <h3>Bienvenido/a Super Admin,</h3>

      <Tabs
        id="superadmin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        mountOnEnter={false}
        unmountOnExit={false}
        className="mt-3 mb-3"
      >
        <Tab eventKey="users" title="Usuarios">
          <UserTable token={token} userId={userId} />
        </Tab>

        <Tab eventKey="propiedades" title="Propiedades">
          <PropertyTable token={token} />
        </Tab>

        <Tab eventKey="pendientes" title="Pendientes">
          <RequestApprovalTable token={token} />
        </Tab>
      </Tabs>
    </Container>
  );
}