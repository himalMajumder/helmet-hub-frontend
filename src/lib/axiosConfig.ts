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
        .then((response) => {
            console.error(response);
        })
        .catch((err: unknown) => {
            console.error(err);
        });
};

// Axios instance with configuration
const axiosConfig: AxiosInstance = axios.create({
    baseURL: `${apiPath}`,
});

// Set default headers
axiosConfig.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axiosConfig.defaults.headers.common["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,PATCH,OPTIONS";

export default axiosConfig;
