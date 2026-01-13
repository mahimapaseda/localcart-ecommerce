import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('localcart-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('localcart-user');
            localStorage.removeItem('localcart-token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
