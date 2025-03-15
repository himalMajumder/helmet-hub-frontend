import axios, { AxiosInstance } from "axios";

const apiPath: string = import.meta.env.VITE_API_URL as string;

// Function to set the CSRF token
export const setCsrfToken = (): void => {
    axios.create({
        baseURL: apiPath,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
    })
        .get('/sanctum/csrf-cookie')
        .then(response => {
            console.log("CSRF cookie set successfully");
        })
        .catch(error => {
            console.error("Error setting CSRF cookie:", error);
        });
};

// Axios instance with configuration
const axiosConfig: AxiosInstance = axios.create({
    baseURL: `${apiPath}/api/v1/`,
});

// Set default headers
axiosConfig.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axiosConfig.defaults.headers.common["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,PATCH,OPTIONS";

export default axiosConfig;
