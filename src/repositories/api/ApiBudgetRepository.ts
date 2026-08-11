import {
  Budget,
  BudgetPeriod,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../../types/budget';
import { BudgetRepository } from '../interfaces/BudgetRepository';
import { apiClient } from '../../services/api/apiClient';

interface ApiBudgetItem {
  id: string;
  name: string;
  amount: string | number;
  period: string;
  start_date: string;
  end_date: string;
  spent?: string | number;
  remaining?: string | number;
  percentage_used?: number;
  status?: string;
  categories?: { category_id: string; amount: string | number }[];
  created_at?: string;
  updated_at?: string;
}

interface ApiBudgetListResponse {
  items: ApiBudgetItem[];
}

function mapBudgetFromApi(item: ApiBudgetItem): Budget {
  const primaryCategoryId = item.categories && item.categories.length > 0 ? item.categories[0].category_id : undefined;

  return {
    id: item.id,
    name: item.name,
    amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount || '0'),
    spent: typeof item.spent === 'number' ? item.spent : parseFloat(item.spent || '0'),
    categoryId: primaryCategoryId,
    period: (item.period.toLowerCase() as BudgetPeriod) || 'monthly',
    startDate: item.start_date,
    endDate: item.end_date,
    isActive: true,
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
  };
}

export class ApiBudgetRepository implements BudgetRepository {
  async getBudgets(): Promise<Budget[]> {
    try {
      const data = await apiClient.request<ApiBudgetListResponse>('/budgets');
      return data.items.map(mapBudgetFromApi);
    } catch (e) {
      console.warn('Failed to fetch budgets from API:', e);
      return [];
    }
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    try {
      const data = await apiClient.request<ApiBudgetItem>(`/budgets/${id}`);
      return mapBudgetFromApi(data);
    } catch {
      return null;
    }
  }

  async createBudget(input: CreateBudgetInput): Promise<Budget> {
    const categoriesPayload = input.categoryId
      ? [{ category_id: input.categoryId, amount: input.amount.toFixed(2) }]
      : [];

    const data = await apiClient.request<ApiBudgetItem>('/budgets', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        amount: input.amount.toFixed(2),
        period: input.period.toUpperCase(),
        start_date: input.startDate,
        end_date: input.endDate,
        categories: categoriesPayload,
      }),
    });
    return mapBudgetFromApi(data);
  }

  async updateBudget(id: string, input: UpdateBudgetInput): Promise<Budget> {
    const body: Record<string, unknown> = {};
    if (input.name !== undefined) body.name = input.name;
    if (input.amount !== undefined) body.amount = input.amount.toFixed(2);
    if (input.startDate) body.start_date = input.startDate;
    if (input.endDate) body.end_date = input.endDate;

    const data = await apiClient.request<ApiBudgetItem>(`/budgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return mapBudgetFromApi(data);
  }

  async updateSpent(_categoryId: string, _spentDelta: number): Promise<void> {
    // Spent is calculated dynamically on the backend!
  }

  async deleteBudget(id: string): Promise<boolean> {
    try {
      await apiClient.request(`/budgets/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  }

  async resetToDefault(): Promise<void> {
    // No-op for real backend
  }
}
