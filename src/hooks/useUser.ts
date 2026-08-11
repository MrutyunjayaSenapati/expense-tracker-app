import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userRepository } from '../repositories';
import { CurrencyCode } from '../types/currency';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';

export function useUser() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['user'],
    queryFn: () => userRepository.getCurrentUser(),
    enabled: isAuthenticated,
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();
  const setStoreCurrency = useAppStore(state => state.setCurrency);
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: (currency: CurrencyCode) => userRepository.updateCurrency(currency),
    onSuccess: user => {
      setStoreCurrency(user.currency);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      showToast(`Currency updated to ${user.currency}`, 'success');
    },
  });
}
