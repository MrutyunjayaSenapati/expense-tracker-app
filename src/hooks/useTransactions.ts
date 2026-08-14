import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  TransactionSort,
} from '../types/transaction';
import {
  transactionRepository,
  accountRepository,
  budgetRepository,
} from '../repositories';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';

import { notificationService } from '../services/notifications/notificationService';

export function useTransactions(
  filters?: TransactionFilters,
  sort: TransactionSort = 'date_desc'
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['transactions', filters, sort],
    queryFn: () => transactionRepository.getTransactions(filters, sort),
    enabled: isAuthenticated,
  });
}

export function useTransaction(id?: string) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => (id ? transactionRepository.getTransactionById(id) : null),
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const created = await transactionRepository.createTransaction(input);

      // Adjust account balance
      const delta = input.type === 'income' ? input.amount : -input.amount;
      try {
        await accountRepository.updateBalance(input.accountId, delta);
      } catch {
        // Balance is updated automatically by backend database trigger
      }

      // If expense, adjust budget spent and evaluate alert threshold
      if (input.type === 'expense') {
        try {
          await budgetRepository.updateSpent(input.categoryId, input.amount);
          const { budgetAlertsEnabled } = useAppStore.getState();
          if (budgetAlertsEnabled) {
            const budgets = queryClient.getQueryData<any[]>(['budgets']);
            const budget = budgets?.find(b => b.categoryId === input.categoryId);
            if (budget && budget.amount > 0) {
              const newSpent = budget.spent + input.amount;
              const pct = Math.round((newSpent / budget.amount) * 100);
              if (pct >= 80) {
                await notificationService.sendBudgetAlert({
                  categoryName: budget.name || 'Category',
                  spent: newSpent,
                  limit: budget.amount,
                  percentage: pct,
                });
              }
            }
          }
        } catch {
          // Ignore
        }
      }

      return created;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      showToast(
        data.type === 'expense' ? 'Expense added successfully' : 'Income added successfully',
        'success'
      );
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to save transaction', 'error');
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateTransactionInput }) => {
      return transactionRepository.updateTransaction(id, input);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      showToast('Transaction updated successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update transaction', 'error');
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  return useMutation({
    mutationFn: async (id: string) => {
      return transactionRepository.deleteTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      showToast('Transaction deleted', 'info');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete transaction', 'error');
    },
  });
}
