import { Transaction } from './transaction';
import { CategorySpending } from './reports';
import { Budget } from './budget';

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  monthlyBudget: number;
  monthlyBudgetSpent: number;
  budgetStatus: 'healthy' | 'warning' | 'exceeded';
  recentTransactions: Transaction[];
  categorySpending: CategorySpending[];
  topBudgets: Budget[];
}
