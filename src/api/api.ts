import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL; 

const api = axios.create({
    baseURL: baseURL, 
    timeout: 5000, 
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

export default api;
