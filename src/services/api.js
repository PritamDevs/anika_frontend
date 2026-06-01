import axios from "axios";
import { BACKEND_URL } from "../config";

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
            `${config.method?.toUpperCase()} ${config.url}`
        );

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();

            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;