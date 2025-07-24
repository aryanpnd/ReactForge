import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/config/apiConfig'
import axios from 'axios'

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  provider?: 'google' | 'email';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: (user) => set({ isAuthenticated: true, user, isLoading: false }),
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Call the backend logout API
          await apiClient.post('/api/auth/logout');
          
          // Clear local state
          set({ isAuthenticated: false, user: null, isLoading: false });
          
          // Clear any stored tokens
          localStorage.removeItem('authToken');
          
        } catch (error) {
          console.error('Logout error:', error);
          
          // Even if API call fails, clear local state
          set({ isAuthenticated: false, user: null, isLoading: false });
          localStorage.removeItem('authToken');
          
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Logout failed');
          }
          throw error;
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
export type { User }