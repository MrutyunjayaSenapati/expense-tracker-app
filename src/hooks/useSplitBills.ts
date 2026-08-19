import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { useAppStore } from '../store/useAppStore';
import { SplitBill, SplitSummary, CreateSplitBillPayload } from '../types/split';

export function useSplitBills(statusFilter?: 'PENDING' | 'SETTLED') {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  // 1. Fetch Split Bills list
  const billsQuery = useQuery<SplitBill[]>({
    queryKey: ['split-bills', statusFilter],
    queryFn: async () => {
      return await apiClient.getSplitBills(statusFilter);
    },
    staleTime: 1000 * 30, // 30s
  });

  // 2. Fetch Summary Metrics
  const summaryQuery = useQuery<SplitSummary>({
    queryKey: ['split-summary'],
    queryFn: async () => {
      return await apiClient.getSplitSummary();
    },
    staleTime: 1000 * 30,
  });

  // 3. Create Split Bill Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateSplitBillPayload) => {
      return await apiClient.createSplitBill(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
      queryClient.invalidateQueries({ queryKey: ['split-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Split bill created successfully', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to create split bill', 'error');
    },
  });

  // 4. Settle / Toggle Participant Mutation
  const settleMutation = useMutation({
    mutationFn: async ({
      billId,
      participantId,
      isPaid,
    }: {
      billId: string;
      participantId: string;
      isPaid: boolean;
    }) => {
      return await apiClient.settleSplitParticipant(billId, participantId, isPaid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
      queryClient.invalidateQueries({ queryKey: ['split-summary'] });
      showToast('Payment status updated', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to update settlement', 'error');
    },
  });

  // 5. Delete Split Bill Mutation
  const deleteMutation = useMutation({
    mutationFn: async (billId: string) => {
      return await apiClient.deleteSplitBill(billId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
      queryClient.invalidateQueries({ queryKey: ['split-summary'] });
      showToast('Split bill removed', 'info');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to delete split bill', 'error');
    },
  });

  return {
    bills: billsQuery.data || [],
    isLoading: billsQuery.isLoading,
    isRefetching: billsQuery.isRefetching,
    refetch: billsQuery.refetch,
    summary: summaryQuery.data || {
      totalOwedToYou: 0,
      totalYouOwe: 0,
      pendingBillsCount: 0,
      settledBillsCount: 0,
    },
    isSummaryLoading: summaryQuery.isLoading,
    createSplitBill: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    settleParticipant: (billId: string, participantId: string, isPaid: boolean = true) =>
      settleMutation.mutateAsync({ billId, participantId, isPaid }),
    isSettling: settleMutation.isPending,
    deleteSplitBill: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
