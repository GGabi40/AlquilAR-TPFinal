import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { isTokenValid, getUserRole } from "./services/auth/tokenValidation";
import { AuthenticationContext } from "./services/auth.context";

export default function Protected({ allowedRoles }) {
    const { token } = useContext(AuthenticationContext);

    if(!token) {
        return <Navigate to="/login" replace />;
    }

    if(!isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    } 

    const userRole = getUserRole(token);
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if(rolesArray.length > 0 && !rolesArray.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />;
}