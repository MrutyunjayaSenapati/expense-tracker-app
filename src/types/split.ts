export interface SplitParticipant {
  id: string;
  userId?: string | null;
  name: string;
  phoneOrUpi?: string | null;
  amountOwed: number;
  isPaid: boolean;
  paidAt?: string | null;
}

export interface SplitUserSummary {
  id: string;
  name: string;
  email?: string | null;
}

export interface SplitBill {
  id: string;
  title: string;
  totalAmount: number;
  yourShare: number;
  paidByUserId: string;
  creatorId: string;
  isSettled: boolean;
  note?: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  paidBy?: SplitUserSummary | null;
  creator?: SplitUserSummary | null;
  participants: SplitParticipant[];
}

export interface SplitSummary {
  totalOwedToYou: number;
  totalYouOwe: number;
  pendingBillsCount: number;
  settledBillsCount: number;
}

export interface CreateSplitBillPayload {
  title: string;
  total_amount: number;
  your_share: number;
  paid_by?: 'YOU' | 'FRIEND';
  payer_name?: string;
  participants: Array<{
    name: string;
    email_or_phone?: string;
    amount_owed: number;
  }>;
  note?: string;
  date?: string;
}
