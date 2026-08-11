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

export function useTransactions(
  filters?: TransactionFilters,
  sort: TransactionSort = 'date_desc'
) {
  return useQuery({
    queryKey: ['transactions', filters, sort],
    queryFn: () => transactionRepository.getTransactions(filters, sort),
  });
}

export function useTransaction(id?: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => (id ? transactionRepository.getTransactionById(id) : null),
    enabled: !!id,
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
        // Account may not exist in mock, ignore error gracefully
      }

      // If expense, adjust budget spent
      if (input.type === 'expense') {
        try {
          await budgetRepository.updateSpent(input.categoryId, input.amount);
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
