import {
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../../types/budget';

export interface BudgetRepository {
  getBudgets(): Promise<Budget[]>;
  getBudgetById(id: string): Promise<Budget | null>;
  createBudget(input: CreateBudgetInput): Promise<Budget>;
  updateBudget(id: string, input: UpdateBudgetInput): Promise<Budget>;
  updateSpent(categoryId: string, spentDelta: number): Promise<void>;
  deleteBudget(id: string): Promise<boolean>;
  resetToDefault(): Promise<void>;
}
