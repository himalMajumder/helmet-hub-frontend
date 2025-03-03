import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { useAppContext } from "@/contexts/AppContext";

interface PrivateRouteProps {
    children: ReactNode;
    permission?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, permission }) => {
    const { is_authenticated, hasPermission } = useAppContext();

    if (permission !== undefined) {
        return is_authenticated ? <>
            {hasPermission(permission) ? children : ""}
        </> : <Navigate to="/login" />;
    }

    return is_authenticated ? <>
        {children}
    </> : <Navigate to="/login" />;
};

export default PrivateRoute;