import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/apiClient';
import { useAppStore } from '../store/useAppStore';
import {
  GroupListItem,
  GroupDetail,
  CreateGroupPayload,
  AddGroupExpensePayload,
  RecordSettlementPayload,
} from '../types/group';

export function useGroups() {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  // 1. Fetch groups list
  const groupsQuery = useQuery<GroupListItem[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const data = await apiClient.getGroups();
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        inviteCode: item.invite_code,
        currency: item.currency,
        creatorId: item.creator_id,
        memberCount: item.member_count,
        yourNetBalance: parseFloat(item.your_net_balance) || 0,
        createdAt: item.created_at,
      }));
    },
    staleTime: 1000 * 30,
  });

  // 2. Create Group
  const createMutation = useMutation({
    mutationFn: async (payload: CreateGroupPayload) => {
      return await apiClient.createGroup(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      showToast('Group created successfully', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to create group', 'error');
    },
  });

  // 3. Join Group by code
  const joinMutation = useMutation({
    mutationFn: async (inviteCode: string) => {
      return await apiClient.joinGroup(inviteCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      showToast('Joined group successfully', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Invalid invite code', 'error');
    },
  });

  return {
    groups: groupsQuery.data || [],
    isLoading: groupsQuery.isLoading,
    isRefetching: groupsQuery.isRefetching,
    refetch: groupsQuery.refetch,
    createGroup: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    joinGroup: joinMutation.mutateAsync,
    isJoining: joinMutation.isPending,
  };
}

export function useGroupDetail(groupId: string) {
  const queryClient = useQueryClient();
  const showToast = useAppStore(state => state.showToast);

  const groupQuery = useQuery<GroupDetail>({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const data = await apiClient.getGroup(groupId);
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        inviteCode: data.invite_code,
        currency: data.currency,
        creatorId: data.creator_id,
        createdAt: data.created_at,
        members: (data.members || []).map((m: any) => ({
          id: m.id,
          userId: m.user_id,
          name: m.name,
          emailOrPhone: m.email_or_phone,
          role: m.role,
          joinedAt: m.joined_at,
        })),
        expenses: (data.expenses || []).map((e: any) => ({
          id: e.id,
          groupId: e.group_id,
          paidByUserId: e.paid_by_user_id,
          payerName: e.payer_name,
          title: e.title,
          amount: parseFloat(e.amount) || 0,
          date: e.date,
          note: e.note,
          createdAt: e.created_at,
          splits: (e.splits || []).map((s: any) => ({
            id: s.id,
            memberId: s.member_id,
            amountOwed: parseFloat(s.amount_owed) || 0,
          })),
        })),
        settlements: (data.settlements || []).map((s: any) => ({
          id: s.id,
          groupId: s.group_id,
          fromUserId: s.from_user_id,
          toUserId: s.to_user_id,
          amount: parseFloat(s.amount) || 0,
          settledAt: s.settled_at,
        })),
        balances: (data.balances || []).map((b: any) => ({
          memberId: b.member_id,
          userId: b.user_id,
          name: b.name,
          paidTotal: parseFloat(b.paid_total) || 0,
          shareTotal: parseFloat(b.share_total) || 0,
          netBalance: parseFloat(b.net_balance) || 0,
        })),
        simplifiedDebts: (data.simplified_debts || []).map((d: any) => ({
          fromMemberId: d.from_member_id,
          fromMemberName: d.from_member_name,
          fromUserId: d.from_user_id,
          toMemberId: d.to_member_id,
          toMemberName: d.to_member_name,
          toUserId: d.to_user_id,
          toUserPhoneOrUpi: d.to_user_phone_or_upi,
          amount: parseFloat(d.amount) || 0,
        })),
        yourNetBalance: parseFloat(data.your_net_balance) || 0,
      };
    },
    enabled: !!groupId,
    staleTime: 1000 * 15,
  });

  // Add Expense Mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (payload: AddGroupExpensePayload) => {
      return await apiClient.addGroupExpense(groupId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast('Expense added to group', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to add group expense', 'error');
    },
  });

  // Record Settlement Mutation
  const settleMutation = useMutation({
    mutationFn: async (payload: RecordSettlementPayload) => {
      return await apiClient.recordGroupSettlement(groupId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      showToast('Settlement recorded', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to record settlement', 'error');
    },
  });

  // Delete Group Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.deleteGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      showToast('Group deleted', 'info');
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to delete group', 'error');
    },
  });

  return {
    group: groupQuery.data,
    isLoading: groupQuery.isLoading,
    isRefetching: groupQuery.isRefetching,
    refetch: groupQuery.refetch,
    addExpense: addExpenseMutation.mutateAsync,
    isAddingExpense: addExpenseMutation.isPending,
    recordSettlement: settleMutation.mutateAsync,
    isSettling: settleMutation.isPending,
    deleteGroup: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
