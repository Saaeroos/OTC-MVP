import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: sessionStorage.getItem('auth_token'),
  isAuthenticated: !!sessionStorage.getItem('auth_token'),
  setAuth: (user, token) => {
    sessionStorage.setItem('auth_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
