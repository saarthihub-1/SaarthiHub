import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the Firebase ID token
api.interceptors.request.use(
    async (config) => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const token = await currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Failed to get Firebase token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    },
};

export const productService = {
    getAll: async () => {
        const response = await api.get('/products');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};

export const paymentService = {
    createOrder: async (orderData) => {
        const response = await api.post('/payment/order', orderData);
        return response.data;
    },
    verifyPayment: async (paymentData) => {
        const response = await api.post('/payment/verify', paymentData);
        return response.data;
    },
};

/**
 * PCM Mindmaps Service
 * Uses Firebase ID token for authentication (same as all other services now)
 */
export const pcmMindmapsService = {
    getPdfUrls: async () => {
        try {
            const response = await api.get('/pcm-mindmaps');
            return response.data;
        } catch (error) {
            if (error.response?.status === 403) {
                return {
                    success: false,
                    requiresPurchase: true,
                    message: error.response.data.message
                };
            }
            throw error;
        }
    }
};

export default api;
