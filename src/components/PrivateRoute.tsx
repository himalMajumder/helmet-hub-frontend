import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { useAppContext } from "@/contexts/AppContext";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { is_authenticated, authenticatedUser, authenticated_token } = useAppContext();
    return is_authenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;