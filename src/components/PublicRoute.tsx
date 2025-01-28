import { isAuthenticated } from "@/lib/auth";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";


interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    return isAuthenticated() ? <Navigate to="/dashboard" /> : <>{children}</>;
};

export default PublicRoute;