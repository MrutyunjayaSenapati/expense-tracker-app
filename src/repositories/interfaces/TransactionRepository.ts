import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  TransactionSort,
} from '../../types/transaction';

export interface TransactionRepository {
  getTransactions(filters?: TransactionFilters, sort?: TransactionSort): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  createTransaction(input: CreateTransactionInput): Promise<Transaction>;
  updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction>;
  deleteTransaction(id: string): Promise<boolean>;
  resetToDefault(): Promise<void>;
}
