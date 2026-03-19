import axios from 'axios';
import { getIdToken, logOut } from './firebase';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

api.interceptors.request.use(async (config) => {
    const token = await getIdToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                logOut();
            } else if (error.response.status === 402) {
                window.dispatchEvent(new CustomEvent('insufficient-credits'));
            } else if (error.response.status === 429) {
                window.dispatchEvent(new CustomEvent('rate-limited'));
            }
        }
        return Promise.reject(error);
    }
);
