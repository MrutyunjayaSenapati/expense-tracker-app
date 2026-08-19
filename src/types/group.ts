export type GroupCategory = 'HOME' | 'TRIP' | 'COUPLE' | 'OTHER';

export interface GroupMember {
  id: string;
  userId?: string | null;
  name: string;
  emailOrPhone?: string | null;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export interface GroupExpenseSplit {
  id: string;
  memberId: string;
  amountOwed: number;
}

export interface GroupExpense {
  id: string;
  groupId: string;
  paidByUserId?: string | null;
  payerName: string;
  title: string;
  amount: number;
  date: string;
  note?: string | null;
  createdAt: string;
  splits: GroupExpenseSplit[];
}

export interface SimplifiedDebt {
  fromMemberId: string;
  fromMemberName: string;
  fromUserId?: string | null;
  toMemberId: string;
  toMemberName: string;
  toUserId?: string | null;
  toUserPhoneOrUpi?: string | null;
  amount: number;
}

export interface MemberBalanceSummary {
  memberId: string;
  userId?: string | null;
  name: string;
  paidTotal: number;
  shareTotal: number;
  netBalance: number;
}

export interface GroupSettlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  settledAt: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  category: GroupCategory;
  inviteCode: string;
  currency: string;
  creatorId: string;
  createdAt: string;
  members: GroupMember[];
  expenses: GroupExpense[];
  settlements: GroupSettlement[];
  balances: MemberBalanceSummary[];
  simplifiedDebts: SimplifiedDebt[];
  yourNetBalance: number;
}

export interface GroupListItem {
  id: string;
  name: string;
  category: GroupCategory;
  inviteCode: string;
  currency: string;
  creatorId: string;
  memberCount: number;
  yourNetBalance: number;
  createdAt: string;
}

export interface CreateGroupPayload {
  name: string;
  category?: GroupCategory;
  currency?: string;
  members?: Array<{
    name: string;
    email_or_phone?: string;
  }>;
}

export interface AddGroupExpensePayload {
  title: string;
  amount: number;
  paid_by_member_id: string;
  split_member_ids?: string[];
  date?: string;
  note?: string;
}

export interface RecordSettlementPayload {
  from_user_id: string;
  to_user_id: string;
  amount: number;
}
