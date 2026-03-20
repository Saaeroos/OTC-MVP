import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TradeList } from './TradeList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTrades } from '../../hooks/queries/useTrades';
import { useAuthStore } from '../../stores/authStore';

vi.mock('../../hooks/queries/useTrades', () => ({
  useTrades: vi.fn(),
}));

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const queryClient = new QueryClient();

describe('TradeList Organism', () => {
  it('renders loading state', () => {
    vi.mocked(useTrades).mockReturnValue({
      trades: [],
      isLoading: true,
    } as unknown as ReturnType<typeof useTrades>);
    vi.mocked(useAuthStore).mockReturnValue(null as unknown as ReturnType<typeof useAuthStore>);

    render(
      <QueryClientProvider client={queryClient}>
        <TradeList />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Loading trades.../i)).toBeInTheDocument();
  });

  it('renders empty state when no trades', () => {
    vi.mocked(useTrades).mockReturnValue({
      trades: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useTrades>);
    vi.mocked(useAuthStore).mockReturnValue(null as unknown as ReturnType<typeof useAuthStore>);

    render(
      <QueryClientProvider client={queryClient}>
        <TradeList />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/No trades found/i)).toBeInTheDocument();
  });

  it('renders list of trades', () => {
    const mockTrades = [
      {
        id: '1',
        trade_id: '19.03.2026-000001.1',
        product: 'Energy',
        seller: 'Seller A',
        buyer: 'Buyer B',
        quantity: 100,
        price: 50,
        total_price: 5000,
        status: 'pending',
        deal_date: '2024-01-01',
      },
    ];

    vi.mocked(useTrades).mockReturnValue({
      trades: mockTrades,
      isLoading: false,
      approveTrade: vi.fn(),
      isApproving: false,
    } as unknown as ReturnType<typeof useTrades>);
    vi.mocked(useAuthStore).mockReturnValue({ role: 'trader' } as unknown as ReturnType<
      typeof useAuthStore
    >);

    render(
      <QueryClientProvider client={queryClient}>
        <TradeList />
      </QueryClientProvider>,
    );

    expect(screen.getByText('TRD-001')).toBeInTheDocument();
    expect(screen.getByText('Seller A')).toBeInTheDocument();
    expect(screen.getByText('Buyer B')).toBeInTheDocument();
  });
});
