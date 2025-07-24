import axios from 'axios';

// Determine if we're in production (build mode)
const isProduction = process.env.NODE_ENV === 'production';

// Global API configuration
export const API_BASE_URL = isProduction
    ? '/' // Use root path in production (dist)
    : 'http://localhost:5000'; // Use localhost in development

// Create global axios instance with base configuration
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies for session management
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
    (config) => {
        // Add any global request modifications here
        // For example, adding auth tokens
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global error handling
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('authToken');
            // Optionally redirect to login
        }
        return Promise.reject(error);
    }
);

// Export API configuration for external use
export const apiConfig = {
    baseURL: API_BASE_URL,
    isProduction,
};