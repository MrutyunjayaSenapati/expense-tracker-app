import { CurrencyCode } from './currency';

export type AccountType =
  | 'cash'
  | 'bank'
  | 'upi'
  | 'credit_card'
  | 'debit_card'
  | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  institutionName?: string;
  balance: number;
  currency: CurrencyCode;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  institutionName?: string;
  balance: number;
  currency?: CurrencyCode;
  icon: string;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  institutionName?: string;
  balance?: number;
  icon?: string;
  isActive?: boolean;
}
