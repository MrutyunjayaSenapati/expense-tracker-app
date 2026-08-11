import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  TransactionSort,
} from '../../types/transaction';
import { TransactionRepository } from '../interfaces/TransactionRepository';
import initialTransactions from '../../data/mock/transactions.json';

export class MockTransactionRepository implements TransactionRepository {
  private transactions: Transaction[] = [...(initialTransactions as Transaction[])];

  async getTransactions(
    filters?: TransactionFilters,
    sort: TransactionSort = 'date_desc'
  ): Promise<Transaction[]> {
    // Simulate brief network latency for realistic loading feel
    await new Promise(resolve => setTimeout(resolve, 80));

    let result = [...this.transactions];

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        result = result.filter(t => t.type === filters.type);
      }

      if (filters.categoryId) {
        result = result.filter(t => t.categoryId === filters.categoryId);
      }

      if (filters.accountId) {
        result = result.filter(t => t.accountId === filters.accountId);
      }

      if (filters.search && filters.search.trim() !== '') {
        const query = filters.search.toLowerCase().trim();
        result = result.filter(
          t =>
            (t.merchant && t.merchant.toLowerCase().includes(query)) ||
            (t.note && t.note.toLowerCase().includes(query))
        );
      }

      if (filters.startDate) {
        const start = new Date(filters.startDate).getTime();
        result = result.filter(t => new Date(t.date).getTime() >= start);
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate).getTime();
        result = result.filter(t => new Date(t.date).getTime() <= end);
      }

      if (filters.minAmount !== undefined) {
        result = result.filter(t => t.amount >= filters.minAmount!);
      }

      if (filters.maxAmount !== undefined) {
        result = result.filter(t => t.amount <= filters.maxAmount!);
      }
    }

    // Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_high':
          return b.amount - a.amount;
        case 'amount_low':
          return a.amount - b.amount;
        case 'date_desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const txn = this.transactions.find(t => t.id === id);
    return txn ? { ...txn } : null;
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: input.type,
      amount: input.amount,
      categoryId: input.categoryId,
      accountId: input.accountId,
      date: input.date,
      merchant: input.merchant,
      note: input.note,
      receiptId: input.receiptId,
      createdAt: now,
      updatedAt: now,
    };

    // Prepend to top of array
    this.transactions.unshift(newTransaction);
    return { ...newTransaction };
  }

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    const existing = this.transactions[index];
    const updated: Transaction = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.transactions[index] = updated;
    return { ...updated };
  }

  async deleteTransaction(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== id);
    return this.transactions.length < initialLength;
  }

  async resetToDefault(): Promise<void> {
    this.transactions = [...(initialTransactions as Transaction[])];
  }
}
