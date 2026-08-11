import {
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../../types/budget';
import { BudgetRepository } from '../interfaces/BudgetRepository';
import initialBudgets from '../../data/mock/budgets.json';

export class MockBudgetRepository implements BudgetRepository {
  private budgets: Budget[] = [...(initialBudgets as Budget[])];

  async getBudgets(): Promise<Budget[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return [...this.budgets];
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    await new Promise(resolve => setTimeout(resolve, 30));
    const budg = this.budgets.find(b => b.id === id);
    return budg ? { ...budg } : null;
  }

  async createBudget(input: CreateBudgetInput): Promise<Budget> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const now = new Date().toISOString();
    const newBudget: Budget = {
      id: `budg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: input.name,
      amount: input.amount,
      spent: 0,
      categoryId: input.categoryId,
      period: input.period,
      startDate: input.startDate,
      endDate: input.endDate,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async updateBudget(id: string, input: UpdateBudgetInput): Promise<Budget> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error(`Budget with id ${id} not found`);
    }
    const updated: Budget = {
      ...this.budgets[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.budgets[index] = updated;
    return { ...updated };
  }

  async updateSpent(categoryId: string, spentDelta: number): Promise<void> {
    const budget = this.budgets.find(b => b.categoryId === categoryId);
    if (budget) {
      budget.spent = Math.max(0, budget.spent + spentDelta);
      budget.updatedAt = new Date().toISOString();
    }
  }

  async deleteBudget(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const initialLength = this.budgets.length;
    this.budgets = this.budgets.filter(b => b.id !== id);
    return this.budgets.length < initialLength;
  }

  async resetToDefault(): Promise<void> {
    this.budgets = [...(initialBudgets as Budget[])];
  }
}
