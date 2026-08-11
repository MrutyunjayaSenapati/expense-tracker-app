import {
  Account,
  AccountType,
  CreateAccountInput,
  UpdateAccountInput,
} from '../../types/account';
import { CurrencyCode } from '../../types/currency';
import { AccountRepository } from '../interfaces/AccountRepository';
import { apiClient } from '../../services/api/apiClient';

interface ApiAccountItem {
  id: string;
  name: string;
  type: string;
  balance: string | number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiAccountListResponse {
  items: ApiAccountItem[];
}

function mapApiTypeToFrontend(type: string): AccountType {
  const t = type.toLowerCase();
  if (t === 'upi_wallet' || t === 'upi') return 'upi';
  if (t === 'credit_card') return 'credit_card';
  if (t === 'debit_card') return 'debit_card';
  if (t === 'cash') return 'cash';
  if (t === 'bank') return 'bank';
  return 'other';
}

function mapFrontendTypeToApi(type: AccountType): string {
  if (type === 'upi') return 'UPI_WALLET';
  if (type === 'credit_card') return 'CREDIT_CARD';
  if (type === 'debit_card') return 'DEBIT_CARD';
  if (type === 'cash') return 'CASH';
  if (type === 'bank') return 'BANK';
  return 'OTHER';
}

function mapAccountFromApi(item: ApiAccountItem): Account {
  const frontendType = mapApiTypeToFrontend(item.type);
  const defaultIcon =
    frontendType === 'bank'
      ? 'building-library'
      : frontendType === 'upi'
      ? 'device-phone-mobile'
      : frontendType === 'credit_card'
      ? 'credit-card'
      : frontendType === 'cash'
      ? 'banknotes'
      : 'wallet';

  return {
    id: item.id,
    name: item.name,
    type: frontendType,
    balance: typeof item.balance === 'number' ? item.balance : parseFloat(item.balance || '0'),
    currency: (item.currency as CurrencyCode) || 'INR',
    icon: defaultIcon,
    isActive: item.is_active,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export class ApiAccountRepository implements AccountRepository {
  async getAccounts(type?: AccountType): Promise<Account[]> {
    try {
      const data = await apiClient.request<ApiAccountListResponse>('/accounts');
      const accounts = data.items.map(mapAccountFromApi);
      if (type) {
        return accounts.filter(a => a.type === type);
      }
      return accounts;
    } catch (e) {
      console.warn('Failed to fetch accounts from API:', e);
      return [];
    }
  }

  async getAccountById(id: string): Promise<Account | null> {
    try {
      const data = await apiClient.request<ApiAccountItem>(`/accounts/${id}`);
      return mapAccountFromApi(data);
    } catch {
      return null;
    }
  }

  async createAccount(input: CreateAccountInput): Promise<Account> {
    const data = await apiClient.request<ApiAccountItem>('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        type: mapFrontendTypeToApi(input.type),
        starting_balance: input.balance.toFixed(2),
      }),
    });
    return mapAccountFromApi(data);
  }

  async updateAccount(id: string, input: UpdateAccountInput): Promise<Account> {
    const body: Record<string, unknown> = {};
    if (input.name !== undefined) body.name = input.name;
    if (input.type !== undefined) body.type = mapFrontendTypeToApi(input.type);

    const data = await apiClient.request<ApiAccountItem>(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return mapAccountFromApi(data);
  }

  async updateBalance(id: string, delta: number): Promise<Account> {
    const account = await this.getAccountById(id);
    if (!account) {
      throw new Error(`Account ${id} not found`);
    }
    return account;
  }

  async deleteAccount(id: string): Promise<boolean> {
    try {
      await apiClient.request(`/accounts/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  }

  async resetToDefault(): Promise<void> {
    // No-op for real backend
  }
}
