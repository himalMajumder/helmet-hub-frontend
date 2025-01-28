export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token"); // Returns true if a token exists
};