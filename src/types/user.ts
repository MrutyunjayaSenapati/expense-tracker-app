import { CurrencyCode } from './currency';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  currency: CurrencyCode;
  locale: string;
  createdAt: string;
}
