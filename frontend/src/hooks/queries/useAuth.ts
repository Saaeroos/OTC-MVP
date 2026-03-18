import { useQuery, useMutation } from '@tanstack/react-query';
import { authService } from '../../api/authService';
import { useAuthStore } from '../../stores/authStore';

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const simulatedUsersQuery = useQuery({
    queryKey: ['simulated-users'],
    queryFn: authService.getSimulatedUsers,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const loginMutation = useMutation({
    mutationFn: authService.simulateLogin,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
    },
  });

  return {
    users: simulatedUsersQuery.data,
    isLoadingUsers: simulatedUsersQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
};
