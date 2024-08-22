// src/utils/axiosInstance.ts
import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_MEDUIM_BACKEND_URL as string,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosInstance;
