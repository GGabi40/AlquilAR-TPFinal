import { Navigate } from "react-router";

export default function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if(!token || user) {
        return <Navigate to="/login" />;
    }

    if(role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}