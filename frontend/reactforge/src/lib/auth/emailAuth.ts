import { User } from '@/store/authStore';
import { apiClient } from '@/lib/config/apiConfig';
import axios from 'axios';

interface LoginData {
    email: string;
    password: string;
}

interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// Email login
export const loginWithEmail = async (data: LoginData): Promise<User> => {
    try {
        const response = await apiClient.post('/api/auth/login', data);

        return {
            id: response.data.user.id,
            email: response.data.user.email,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            avatar: response.data.user.avatar,
            provider: 'email'
        };
    } catch (error) {
        console.error('Email login error:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw error;
    }
};

// Email signup
export const signupWithEmail = async (data: SignupData): Promise<User> => {
    try {
        const response = await apiClient.post('/api/auth/signup', data);

        return {
            id: response.data.user.id,
            email: response.data.user.email,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            avatar: response.data.user.avatar,
            provider: 'email'
        };
    } catch (error) {
        console.error('Email signup error:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
        throw error;
    }
};