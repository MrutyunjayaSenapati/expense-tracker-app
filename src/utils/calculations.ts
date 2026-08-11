import { Transaction } from '../types/transaction';
import { Category } from '../types/category';
import { Account } from '../types/account';
import { BudgetStatus } from '../types/budget';
import { CategorySpending, SpendingTrendPoint } from '../types/reports';
import { formatRelativeDate, getGroupedDateKey } from './date';

export function calculateBudgetStatus(spent: number, amount: number): BudgetStatus {
  if (amount <= 0) return 'healthy';
  const percentage = (spent / amount) * 100;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 80) return 'warning';
  return 'healthy';
}

export function calculateBudgetPercentage(spent: number, amount: number): number {
  if (amount <= 0) return 0;
  return Math.min(Math.round((spent / amount) * 100), 999);
}

export function calculateTotalBalance(accounts: Account[]): number {
  return accounts
    .filter(a => a.isActive)
    .reduce((sum, a) => sum + a.balance, 0);
}

export function calculateTotals(transactions: Transaction[]): {
  income: number;
  expense: number;
  netSavings: number;
} {
  let income = 0;
  let expense = 0;

  for (const txn of transactions) {
    if (txn.type === 'income') {
      income += txn.amount;
    } else if (txn.type === 'expense') {
      expense += txn.amount;
    }
  }

  return {
    income,
    expense,
    netSavings: income - expense,
  };
}

export function calculateCategorySpending(
  transactions: Transaction[],
  categories: Category[],
  type: 'expense' | 'income' = 'expense'
): CategorySpending[] {
  const filtered = transactions.filter(t => t.type === type);
  const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<string, { amount: number; count: number }>();

  for (const txn of filtered) {
    const current = categoryMap.get(txn.categoryId) || { amount: 0, count: 0 };
    categoryMap.set(txn.categoryId, {
      amount: current.amount + txn.amount,
      count: current.count + 1,
    });
  }

  const categoryLookup = new Map(categories.map(c => [c.id, c]));

  const result: CategorySpending[] = [];

  for (const [categoryId, data] of categoryMap.entries()) {
    const category = categoryLookup.get(categoryId);
    const percentage = totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0;

    result.push({
      categoryId,
      categoryName: category?.name ?? 'Other',
      categoryIcon: category?.icon ?? 'apps',
      categoryColor: category?.colorToken ?? '#6B7280',
      amount: data.amount,
      transactionCount: data.count,
      percentage: Math.round(percentage * 10) / 10,
    });
  }

  return result.sort((a, b) => b.amount - a.amount);
}

export function generateSpendingTrend(transactions: Transaction[]): SpendingTrendPoint[] {
  const pointsMap = new Map<string, { income: number; expense: number; label: string }>();

  // Sort chronologically
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const txn of sorted) {
    const key = getGroupedDateKey(txn.date);
    const label = formatRelativeDate(txn.date);
    const current = pointsMap.get(key) || { income: 0, expense: 0, label };

    if (txn.type === 'income') {
      current.income += txn.amount;
    } else {
      current.expense += txn.amount;
    }

    pointsMap.set(key, current);
  }

  return Array.from(pointsMap.entries()).map(([date, data]) => ({
    date,
    label: data.label,
    income: data.income,
    expense: data.expense,
  }));
}
