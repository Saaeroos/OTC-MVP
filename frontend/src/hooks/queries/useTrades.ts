import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradeService } from '../../api/tradeService';
import { Trade, TradeCreate, PaginatedTrades } from '../../types';

export const useTrades = (page: number = 1, size: number = 10) => {
  const queryClient = useQueryClient();

  const tradesQuery = useQuery({
    queryKey: ['trades', page, size],
    queryFn: () => tradeService.getTrades(page, size),
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 10, // 10 seconds
  });

  const createTradeMutation = useMutation({
    mutationFn: tradeService.createTrade,
    onMutate: async (newTradeData: TradeCreate) => {
      // Cancel outgoing refetches (so they don't overwrite optimistic update)
      await queryClient.cancelQueries({ queryKey: ['trades', page, size] });

      const previousData = queryClient.getQueryData<PaginatedTrades>(['trades', page, size]);

      // Optimistic update
      if (previousData) {
        const optimisticTrade: Trade = {
          ...newTradeData,
          id: `temp-${Date.now()}`,
          trade_id: 'generating...',
          deal_date: new Date().toISOString().split('T')[0],
          total_price: Number(newTradeData.quantity) * Number(newTradeData.price),
          currency: newTradeData.currency || 'EUR',
          status: 'pending',
          created_by: 'me', // placeholder
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          division: undefined, // division data might be incomplete here
        };
        queryClient.setQueryData(['trades', page, size], {
          ...previousData,
          items: [optimisticTrade, ...previousData.items],
        });
      }

      return { previousData };
    },
    onError: (err, newTrade, context) => {
      // Rollback on Error
      if (context?.previousData) {
        queryClient.setQueryData(['trades', page, size], context.previousData);
      }
    },
    onSettled: () => {
      // Refetch after success or error
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });

  // Approve with Optimistic Update
  const approveTradeMutation = useMutation({
    mutationFn: tradeService.approveTrade,
    onMutate: async (tradeId: string) => {
      await queryClient.cancelQueries({ queryKey: ['trades', page, size] });

      const previousData = queryClient.getQueryData<PaginatedTrades>(['trades', page, size]);

      if (previousData) {
        const updatedTrades = previousData.items.map((trade) =>
          trade.id === tradeId ? { ...trade, status: 'approved' as const } : trade,
        );
        queryClient.setQueryData(['trades', page, size], {
          ...previousData,
          items: updatedTrades,
        });
      }

      return { previousData };
    },
    onError: (err, tradeId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['trades', page, size], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });

  return {
    trades: tradesQuery.data?.items,
    pagination: tradesQuery.data
      ? {
          total: tradesQuery.data.total,
          page: tradesQuery.data.page,
          size: tradesQuery.data.size,
          pages: tradesQuery.data.pages,
        }
      : null,
    isLoading: tradesQuery.isLoading,
    isError: tradesQuery.isError,
    error: tradesQuery.error,
    createTrade: createTradeMutation.mutate,
    isCreating: createTradeMutation.isPending,
    approveTrade: approveTradeMutation.mutate,
    isApproving: approveTradeMutation.isPending,
    approvingId: approveTradeMutation.isPending ? approveTradeMutation.variables : null,
  };
};
