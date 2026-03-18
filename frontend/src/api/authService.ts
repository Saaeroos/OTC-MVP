import apiClient from './client';
import { User, AuthResponse } from '../types';

export const authService = {
  getSimulatedUsers: async () => {
    const { data } = await apiClient.get<User[]>('/api/auth/simulated-users');
    return data;
  },

  simulateLogin: async (username: string) => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/simulate-login', { username });
    return data;
  },
};
