import { User } from '../../types/user';
import { CurrencyCode } from '../../types/currency';
import { UserRepository } from '../interfaces/UserRepository';
import { apiClient } from '../../services/api/apiClient';

interface ApiUserResponse {
  id: string;
  name: string;
  email: string;
  currency?: string;
  avatar_url?: string | null;
  created_at: string;
}

export class ApiUserRepository implements UserRepository {
  private localCurrency: CurrencyCode = 'INR';

  async getCurrentUser(): Promise<User> {
    try {
      const data = await apiClient.request<ApiUserResponse>('/auth/me');
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatar_url,
        currency: (data.currency as CurrencyCode) || this.localCurrency,
        locale: 'en-IN',
        createdAt: data.created_at,
      };
    } catch {
      return {
        id: '',
        name: 'User',
        email: '',
        currency: this.localCurrency,
        locale: 'en-IN',
        createdAt: new Date().toISOString(),
      };
    }
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    if (updates.currency) {
      this.localCurrency = updates.currency;
    }
    return this.getCurrentUser();
  }

  async updateCurrency(currency: CurrencyCode): Promise<User> {
    this.localCurrency = currency;
    return this.getCurrentUser();
  }
}
