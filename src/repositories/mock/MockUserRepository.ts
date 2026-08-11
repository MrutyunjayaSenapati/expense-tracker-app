import { User } from '../../types/user';
import { CurrencyCode } from '../../types/currency';
import { UserRepository } from '../interfaces/UserRepository';
import initialUsers from '../../data/mock/users.json';

export class MockUserRepository implements UserRepository {
  private user: User = { ...(initialUsers[0] as User) };

  async getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 30));
    return { ...this.user };
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 60));
    this.user = {
      ...this.user,
      ...updates,
    };
    return { ...this.user };
  }

  async updateCurrency(currency: CurrencyCode): Promise<User> {
    return this.updateUser({ currency });
  }
}
