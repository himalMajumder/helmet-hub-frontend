import axiosConfig, { setCsrfToken } from "@/lib/axiosConfig";
import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {TokenType, UserType} from "@/lib/types";

interface AppState {
    authenticatedUser: UserType | null;
    is_authenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    authenticated_token: TokenType;
    setAuthenticatedToken: (token: string | null) => void;
    setAuthenticatedUser: (user: UserType | null) => void;
    set_authentication: (isAuthenticated: boolean) => void;
    set_authentication_token: (token: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode
}

export const AppProvider = ({ children }: UserProviderProps) => {

    const [is_authenticated, setIsAuthenticated] = useState(false);
    const [authenticated_token, setAuthenticatedToken] = useState(null);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserType>(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state


    const set_authentication = (isAuthenticated: boolean) => {
        setIsAuthenticated(isAuthenticated);
    };

    const set_authentication_token = (token: string | null) => {
        setAuthenticatedToken(token);
        localStorage.setItem("token", token);
    }

    useEffect(() => {
        setCsrfToken();

        const fetchData = async () => {
            try {
                const response = await axiosConfig({
                    method: "get",
                    url: "user",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                set_authentication(true);
                set_authentication_token(token);
                let data = response.data.data;
                 
                setAuthenticatedUser(data);

            } catch (error) {
                set_authentication(false);
                set_authentication_token('');
                setAuthenticatedUser(null);
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); // Set loading to false after the check is complete
            }
        };
        let token = localStorage.getItem("token");

        if (token) {
            fetchData();
        }
        else{
            setIsLoading(false);
        }

    }, []);


    // If still loading, show a loading spinner or nothing
    if (isLoading) {
        return <div>Loading...</div>; // Or a loading spinner
    }
    
    return (
        <AppContext.Provider value={{
            is_authenticated,
            setIsAuthenticated,
            authenticated_token,
            setAuthenticatedToken,
            authenticatedUser,
            setAuthenticatedUser,
            set_authentication,
            set_authentication_token
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
