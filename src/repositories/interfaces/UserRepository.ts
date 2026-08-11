import { User } from '../../types/user';
import { CurrencyCode } from '../../types/currency';

export interface UserRepository {
  getCurrentUser(): Promise<User>;
  updateUser(updates: Partial<User>): Promise<User>;
  updateCurrency(currency: CurrencyCode): Promise<User>;
}
