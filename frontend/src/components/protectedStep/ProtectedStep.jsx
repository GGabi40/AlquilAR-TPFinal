import { Navigate, Outlet, useLocation } from "react-router";

const stepsOrder = [ "location", "features", "images", "preview" ];

export default function ProtectedStep({ currentStep }) {
    const location = useLocation();
    const currentPath = location.pathname.split("/").pop();

    const allowedIndex = stepsOrder.indexOf(currentStep);
    const tryingIndex = stepsOrder.indexOf(currentPath);

    if (tryingIndex > allowedIndex) {
        return <Navigate to={`/add-property/${currentStep}`} replace />;
    }

    return <Outlet />;
}