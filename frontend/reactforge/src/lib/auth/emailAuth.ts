import { User } from '@/store/authStore';

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
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const result = await response.json();

        return {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            avatar: result.user.avatar,
            provider: 'email'
        };
    } catch (error) {
        console.error('Email login error:', error);
        throw error;
    }
};

// Email signup
export const signupWithEmail = async (data: SignupData): Promise<User> => {
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }

        const result = await response.json();

        return {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            avatar: result.user.avatar,
            provider: 'email'
        };
    } catch (error) {
        console.error('Email signup error:', error);
        throw error;
    }
};