export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string;
  merchant?: string;
  note?: string;
  receiptId?: string;
  recurringTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string;
  merchant?: string;
  note?: string;
  receiptId?: string;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  amount?: number;
  categoryId?: string;
  accountId?: string;
  date?: string;
  merchant?: string;
  note?: string;
  receiptId?: string;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType | 'all';
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export type TransactionSort =
  | 'date_desc'
  | 'date_asc'
  | 'amount_high'
  | 'amount_low';
