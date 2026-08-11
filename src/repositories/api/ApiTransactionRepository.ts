import {
  Transaction,
  TransactionType,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  TransactionSort,
} from '../../types/transaction';
import { TransactionRepository } from '../interfaces/TransactionRepository';
import { apiClient } from '../../services/api/apiClient';

interface ApiTransactionItem {
  id: string;
  account: { id: string; name: string };
  category: { id: string; name: string; type: string };
  amount: string | number;
  type: string;
  merchant?: string | null;
  note?: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

interface ApiTransactionListResponse {
  items: ApiTransactionItem[];
  total: number;
}

function mapTransactionFromApi(item: ApiTransactionItem): Transaction {
  return {
    id: item.id,
    type: item.type.toLowerCase() as TransactionType,
    amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount || '0'),
    categoryId: item.category?.id || '',
    accountId: item.account?.id || '',
    date: item.transaction_date,
    merchant: item.merchant || undefined,
    note: item.note || undefined,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export class ApiTransactionRepository implements TransactionRepository {
  async getTransactions(
    filters?: TransactionFilters,
    sort: TransactionSort = 'date_desc'
  ): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();
      params.append('limit', '100');

      if (filters) {
        if (filters.type && filters.type !== 'all') {
          params.append('type', filters.type.toUpperCase());
        }
        if (filters.categoryId) {
          params.append('category_id', filters.categoryId);
        }
        if (filters.accountId) {
          params.append('account_id', filters.accountId);
        }
        if (filters.search && filters.search.trim()) {
          params.append('search', filters.search.trim());
        }
        if (filters.startDate) {
          params.append('start_date', new Date(filters.startDate).toISOString());
        }
        if (filters.endDate) {
          params.append('end_date', new Date(filters.endDate).toISOString());
        }
        if (filters.minAmount !== undefined) {
          params.append('min_amount', filters.minAmount.toString());
        }
        if (filters.maxAmount !== undefined) {
          params.append('max_amount', filters.maxAmount.toString());
        }
      }

      // Sort
      if (sort === 'date_asc') {
        params.append('sort', 'transaction_date');
        params.append('order', 'asc');
      } else if (sort === 'amount_high') {
        params.append('sort', 'amount');
        params.append('order', 'desc');
      } else if (sort === 'amount_low') {
        params.append('sort', 'amount');
        params.append('order', 'asc');
      } else {
        params.append('sort', 'transaction_date');
        params.append('order', 'desc');
      }

      const queryString = params.toString();
      const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;
      const data = await apiClient.request<ApiTransactionListResponse>(endpoint);

      return data.items.map(mapTransactionFromApi);
    } catch (e) {
      console.warn('Failed to fetch transactions from API:', e);
      return [];
    }
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const data = await apiClient.request<ApiTransactionItem>(`/transactions/${id}`);
      return mapTransactionFromApi(data);
    } catch {
      return null;
    }
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const data = await apiClient.request<ApiTransactionItem>('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        account_id: input.accountId,
        category_id: input.categoryId,
        amount: input.amount.toFixed(2),
        type: input.type.toUpperCase(),
        merchant: input.merchant,
        note: input.note,
        transaction_date: input.date ? new Date(input.date).toISOString() : new Date().toISOString(),
      }),
    });
    return mapTransactionFromApi(data);
  }

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const body: Record<string, unknown> = {};
    if (input.accountId) body.account_id = input.accountId;
    if (input.categoryId) body.category_id = input.categoryId;
    if (input.amount !== undefined) body.amount = input.amount.toFixed(2);
    if (input.type) body.type = input.type.toUpperCase();
    if (input.merchant !== undefined) body.merchant = input.merchant;
    if (input.note !== undefined) body.note = input.note;
    if (input.date) body.transaction_date = new Date(input.date).toISOString();

    const data = await apiClient.request<ApiTransactionItem>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return mapTransactionFromApi(data);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      await apiClient.request(`/transactions/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  }

  async resetToDefault(): Promise<void> {
    // No-op for real backend
  }
}
