import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: (user) => set({ isAuthenticated: true, user, isLoading: false }),
      logout: () => set({ isAuthenticated: false, user: null, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
export type { User }