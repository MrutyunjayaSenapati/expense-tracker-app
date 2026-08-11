export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom';

export type BudgetStatus = 'healthy' | 'warning' | 'exceeded';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  categoryId?: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetInput {
  name: string;
  amount: number;
  categoryId?: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
}

export interface UpdateBudgetInput {
  name?: string;
  amount?: number;
  categoryId?: string;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
