import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradeService } from '../../api/tradeService';
import { Trade, TradeCreate } from '../../types';

export const useTrades = () => {
  const queryClient = useQueryClient();

  const tradesQuery = useQuery({
    queryKey: ['trades'],
    queryFn: tradeService.getTrades,
    staleTime: 1000 * 15, // 15 seconds
  });

  const createTradeMutation = useMutation({
    mutationFn: tradeService.createTrade,
    onMutate: async (newTradeData: TradeCreate) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['trades'] });

      const previousTrades = queryClient.getQueryData<Trade[]>(['trades']);

      // Optimistic update
      if (previousTrades) {
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
        queryClient.setQueryData(['trades'], [optimisticTrade, ...previousTrades]);
      }

      return { previousTrades };
    },
    onError: (err, newTrade, context) => {
      // Rollback on Error
      if (context?.previousTrades) {
        queryClient.setQueryData(['trades'], context.previousTrades);
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
      await queryClient.cancelQueries({ queryKey: ['trades'] });

      const previousTrades = queryClient.getQueryData<Trade[]>(['trades']);

      if (previousTrades) {
        const updatedTrades = previousTrades.map((trade) =>
          trade.id === tradeId ? { ...trade, status: 'approved' as const } : trade,
        );
        queryClient.setQueryData(['trades'], updatedTrades);
      }

      return { previousTrades };
    },
    onError: (err, tradeId, context) => {
      if (context?.previousTrades) {
        queryClient.setQueryData(['trades'], context.previousTrades);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });

  return {
    trades: tradesQuery.data,
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
