import {
  Account,
  AccountType,
  CreateAccountInput,
  UpdateAccountInput,
} from '../../types/account';
import { AccountRepository } from '../interfaces/AccountRepository';
import initialAccounts from '../../data/mock/accounts.json';

export class MockAccountRepository implements AccountRepository {
  private accounts: Account[] = [...(initialAccounts as Account[])];

  async getAccounts(type?: AccountType): Promise<Account[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (!type) return [...this.accounts];
    return this.accounts.filter(a => a.type === type);
  }

  async getAccountById(id: string): Promise<Account | null> {
    await new Promise(resolve => setTimeout(resolve, 30));
    const acc = this.accounts.find(a => a.id === id);
    return acc ? { ...acc } : null;
  }

  async createAccount(input: CreateAccountInput): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const now = new Date().toISOString();
    const newAccount: Account = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      type: input.type,
      institutionName: input.institutionName,
      balance: input.balance,
      currency: input.currency ?? 'INR',
      icon: input.icon,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.accounts.push(newAccount);
    return { ...newAccount };
  }

  async updateAccount(id: string, input: UpdateAccountInput): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const index = this.accounts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Account with id ${id} not found`);
    }
    const updated: Account = {
      ...this.accounts[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.accounts[index] = updated;
    return { ...updated };
  }

  async updateBalance(id: string, delta: number): Promise<Account> {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Account with id ${id} not found`);
    }
    const current = this.accounts[index];
    const updated: Account = {
      ...current,
      balance: current.balance + delta,
      updatedAt: new Date().toISOString(),
    };
    this.accounts[index] = updated;
    return { ...updated };
  }

  async deleteAccount(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const initialLength = this.accounts.length;
    this.accounts = this.accounts.filter(a => a.id !== id);
    return this.accounts.length < initialLength;
  }

  async resetToDefault(): Promise<void> {
    this.accounts = [...(initialAccounts as Account[])];
  }
}
