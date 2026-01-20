import axios, { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * API Client for Inframate Backend
 * 
 * Handles all HTTP requests with automatic token injection and error handling.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            clearTokens();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ==========================
// TOKEN MANAGEMENT
// ==========================

const ACCESS_TOKEN_KEY = 'inframate_access_token';
const USER_KEY = 'inframate_user';

export function setAccessToken(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
}

export function getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
}

export function setUser(user: any) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

export function getUser(): any | null {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }
    return null;
}

export function clearTokens() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}

// ==========================
// API METHODS
// ==========================

export const authApi = {
    login: async (email: string, password: string) => {
        const { data } = await apiClient.post('/auth/login', { email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    },

    register: async (formData: any) => {
        const { data } = await apiClient.post('/auth/register', formData);
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    },

    logout: () => {
        clearTokens();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },
};

export const issuesApi = {
    getAll: async () => {
        const { data } = await apiClient.get('/issues');
        return data;
    },

    getMyCreated: async () => {
        const { data } = await apiClient.get('/issues/my-created');
        return data;
    },

    getMyAssigned: async () => {
        const { data } = await apiClient.get('/issues/my-assigned');
        return data;
    },

    getById: async (id: string) => {
        const { data } = await apiClient.get(`/issues/${id}`);
        return data;
    },

    create: async (issueData: any) => {
        const { data } = await apiClient.post('/issues', issueData);
        return data;
    },

    assign: async (id: string, assignData: any) => {
        const { data } = await apiClient.patch(`/issues/${id}/assign`, assignData);
        return data;
    },

    updateStatus: async (id: string, statusData: any) => {
        const { data } = await apiClient.patch(`/issues/${id}/status`, statusData);
        return data;
    },
};

export const usersApi = {
    getMe: async () => {
        const { data } = await apiClient.get('/users/me');
        return data;
    },

    getAll: async () => {
        const { data } = await apiClient.get('/users');
        return data;
    },
};

export const campusApi = {
    getAll: async () => {
        const { data } = await apiClient.get('/campuses');
        return data;
    },

    getById: async (id: string) => {
        const { data } = await apiClient.get(`/campuses/${id}`);
        return data;
    },
};
