// PrivateRoute.tsx
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./UserRole";

interface PrivateRouteProps {
    allowedRoles: ("admin" | "user")[];
    children: ReactNode;
}

const PrivateRoute = ({ allowedRoles, children }: PrivateRouteProps) => {
    const { role } = useAuth();
    const location = useLocation();

    // ------------------------------------
    // 1️⃣ User NOT logged in → go to Login
    // ------------------------------------
    if (!role) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location }}
            />
        );
    }

    // ----------------------------------------------------
    // 2️⃣ User logged in BUT does NOT have the right role
    // ----------------------------------------------------
    if (!allowedRoles.includes(role)) {
        return (
            <Navigate
                to="/AuthFaild"
                replace
                state={{ from: location }}
            />
        );
    }

    // ------------------------------
    // 3️⃣ User authorized → access OK
    // ------------------------------
    return <>{children}</>;
};

export default PrivateRoute;
