import apiClient from './client';
import { Trade, TradeCreate, Division } from '../types';

export const tradeService = {
  getTrades: async () => {
    const { data } = await apiClient.get<Trade[]>('/api/trades');
    return data;
  },

  getTrade: async (tradeId: string) => {
    const { data } = await apiClient.get<Trade>(`/api/trades/${tradeId}`);
    return data;
  },

  createTrade: async (trade: TradeCreate) => {
    const { data } = await apiClient.post<Trade>('/api/trades', trade);
    return data;
  },

  approveTrade: async (tradeId: string) => {
    const { data } = await apiClient.put<Trade>(`/api/trades/${tradeId}/approve`);
    return data;
  },

  getDivisions: async () => {
    const { data } = await apiClient.get<Division[]>('/api/divisions');
    return data;
  },
};
