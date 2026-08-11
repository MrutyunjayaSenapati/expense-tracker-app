import { TransactionType } from './transaction';

export type RecurrenceFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export interface RecurringTransaction {
  id: string;
  name: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: RecurrenceFrequency;
  nextOccurrence: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}
