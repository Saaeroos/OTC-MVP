import { useQuery } from '@tanstack/react-query';
import { tradeService } from '../../api/tradeService';

export const useDivisions = () => {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: tradeService.getDivisions,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
