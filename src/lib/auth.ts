import axiosConfig, { setCsrfToken } from "./axiosConfig";

const userData = async (): Promise<boolean> => {
    try {
        let token = localStorage.getItem("token");

        const response = await axiosConfig({
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "get",
            url: "user",
        });
        console.log(response.data);
        return true;

    } catch (error) {
        console.error("Error fetching user data:", error);

        localStorage.setItem("token", "");

        return false;
    }
};
 
export const isAuthenticated = async (): Promise<boolean> => {
    let token = localStorage.getItem("token");
    if (!token) return false;

    return await userData();
}; 