import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountType, CreateAccountInput, UpdateAccountInput } from '../types/account';
import { accountRepository } from '../repositories';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';

export function useAccounts(type?: AccountType) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['accounts', type],
    queryFn: () => accountRepository.getAccounts(type),
    enabled: isAuthenticated,
  });
}

export function useAccount(id?: string) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['account', id],
    queryFn: () => (id ? accountRepository.getAccountById(id) : null),
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: (input: CreateAccountInput) => accountRepository.createAccount(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Account added successfully', 'success');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to add account', 'error');
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAccountInput }) =>
      accountRepository.updateAccount(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Account updated', 'success');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update account', 'error');
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: (id: string) => accountRepository.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Account deleted', 'info');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to delete account', 'error');
    },
  });
}
