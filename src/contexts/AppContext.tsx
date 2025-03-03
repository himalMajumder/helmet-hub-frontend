import axiosConfig, { setCsrfToken } from "@/lib/axiosConfig";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { PermissionType, TokenType, UserType } from "@/lib/types";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AppState {
    authenticatedUser: UserType | null;
    authenticatedUserPermissions: PermissionType[] | null;
    is_authenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    authenticated_token: TokenType;
    setAuthenticatedToken: (token: string | null) => void;
    setAuthenticatedUser: (user: UserType | null) => void;
    setAuthenticatedUserPermissions: (permissions: PermissionType[] | null) => void;
    set_authentication: (isAuthenticated: boolean) => void;
    set_authentication_token: (token: string | null) => void;
    hasPermission: (permissionName: string) => boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode
}

export const AppProvider = ({ children }: UserProviderProps) => {

    const [is_authenticated, setIsAuthenticated] = useState(false);
    const [authenticated_token, setAuthenticatedToken] = useState(null);
    const [authenticatedUser, setAuthenticatedUser] = useState<UserType>(null);
    const [authenticatedUserPermissions, setAuthenticatedUserPermissions] = useState<PermissionType[]>(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state


    const set_authentication = (isAuthenticated: boolean) => {
        setIsAuthenticated(isAuthenticated);
    };

    const set_authentication_token = (token: string | null) => {
        setAuthenticatedToken(token);
        localStorage.setItem("token", token);
    }

    const hasPermission = (permissionName: string): boolean => {
        /**
         * Check if the user is a super admin
         */
        if (authenticatedUser.super_admin) {
            return true;
        }
        /**
         * Check if the user has the permission
         */
        const findPermission = authenticatedUserPermissions?.find((permission) => permission.name === permissionName);

        return !!findPermission;
    };

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
                setAuthenticatedUserPermissions(data.permissions);
                setAuthenticatedUser(data);

            } catch (error) {
                set_authentication(false);
                set_authentication_token('');
                setAuthenticatedUser(null);
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let token = localStorage.getItem("token");

        if (token) {
            fetchData();
        }
        else {
            setIsLoading(false);
        }

    }, []);


    // If still loading, show a loading spinner or nothing
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center z-50">
                <div className="text-center">
                    <LoadingSpinner className="mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Please wait while we prepare your experience...
                    </p>
                </div>
            </div>
        );
    }


    return (
        <AppContext.Provider value={{
            is_authenticated,
            setIsAuthenticated,
            authenticated_token,
            setAuthenticatedToken,
            authenticatedUser,
            authenticatedUserPermissions,
            setAuthenticatedUser,
            setAuthenticatedUserPermissions,
            set_authentication,
            set_authentication_token,
            hasPermission
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
