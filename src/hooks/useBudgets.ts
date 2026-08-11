import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateBudgetInput, UpdateBudgetInput } from '../types/budget';
import { budgetRepository } from '../repositories';
import { useAppStore } from '../store/useAppStore';

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetRepository.getBudgets(),
  });
}

export function useBudget(id?: string) {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: () => (id ? budgetRepository.getBudgetById(id) : null),
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: (input: CreateBudgetInput) => budgetRepository.createBudget(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Budget created successfully', 'success');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to create budget', 'error');
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBudgetInput }) =>
      budgetRepository.updateBudget(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Budget updated', 'success');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update budget', 'error');
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: (id: string) => budgetRepository.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Budget deleted', 'info');
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to delete budget', 'error');
    },
  });
}
