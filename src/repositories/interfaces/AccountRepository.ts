import {
  Account,
  AccountType,
  CreateAccountInput,
  UpdateAccountInput,
} from '../../types/account';

export interface AccountRepository {
  getAccounts(type?: AccountType): Promise<Account[]>;
  getAccountById(id: string): Promise<Account | null>;
  createAccount(input: CreateAccountInput): Promise<Account>;
  updateAccount(id: string, input: UpdateAccountInput): Promise<Account>;
  updateBalance(id: string, delta: number): Promise<Account>;
  deleteAccount(id: string): Promise<boolean>;
  resetToDefault(): Promise<void>;
}
