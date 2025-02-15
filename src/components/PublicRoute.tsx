import { useAppContext } from "@/contexts/AppContext";
import { isAuthenticated } from "@/lib/auth";
import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { is_authenticated, user, authenticated_token } = useAppContext();
    return is_authenticated ? <Navigate to="/" /> : <>{children}</>;
};

export default PublicRoute;