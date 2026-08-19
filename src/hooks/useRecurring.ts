import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { useAppStore } from '../store/useAppStore';

export interface RecurringItem {
  id: string;
  account: {
    id: string;
    name: string;
    type: string;
  };
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: string;
  };
  type: 'EXPENSE' | 'INCOME';
  amount: string | number;
  merchant?: string;
  note?: string;
  frequency: 'DAILY' | 'MONTHLY';
  startDate: string;
  endDate?: string;
  nextOccurrence: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useRecurring() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  const query = useQuery({
    queryKey: ['recurring-transactions'],
    queryFn: async () => {
      const raw = await apiClient.getRecurringTransactions();
      return raw.map(i => ({
        id: i.id,
        account: i.account,
        category: i.category,
        type: i.type,
        amount: Number(i.amount),
        merchant: i.merchant,
        note: i.note,
        frequency: i.frequency,
        startDate: i.start_date,
        endDate: i.end_date,
        nextOccurrence: i.next_occurrence,
        isActive: i.is_active,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
      })) as RecurringItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      account_id: string;
      category_id: string;
      type: 'EXPENSE' | 'INCOME';
      amount: number;
      merchant?: string;
      note?: string;
      frequency: 'DAILY' | 'MONTHLY';
      start_date: string;
      end_date?: string;
    }) => {
      return await apiClient.createRecurringTransaction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Subscription added successfully', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to create subscription', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        is_active?: boolean;
        amount?: number;
        merchant?: string;
        frequency?: 'DAILY' | 'MONTHLY';
      };
    }) => {
      return await apiClient.updateRecurringTransaction(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to update subscription', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.deleteRecurringTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Subscription removed', 'info');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to delete subscription', 'error');
    },
  });

  // Calculate total monthly overhead (Active expenses converted to monthly)
  const items = query.data || [];
  const monthlyTotal = items
    .filter(i => i.isActive && i.type === 'EXPENSE')
    .reduce((sum, i) => {
      const amt = Number(i.amount);
      if (i.frequency === 'DAILY') return sum + amt * 30;
      return sum + amt;
    }, 0);

  return {
    ...query,
    recurringList: items,
    monthlyTotal,
    createRecurring: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateRecurring: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteRecurring: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
