import { useQuery } from '@tanstack/react-query';
import {
  transactionRepository,
  accountRepository,
  budgetRepository,
  categoryRepository,
} from '../repositories';
import { apiClient } from '../services/api/apiClient';
import { useAuthStore } from '../store/useAuthStore';
import { DashboardSummary } from '../types/dashboard';
import {
  calculateTotalBalance,
  calculateTotals,
  calculateCategorySpending,
  calculateBudgetStatus,
} from '../utils/calculations';

export function useDashboardData() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['dashboard'],
    enabled: isAuthenticated,
    queryFn: async (): Promise<DashboardSummary> => {
      // 1. Fetch live data from all API repositories & dashboard endpoint in parallel
      const [transactions, accounts, budgets, categories, dashboardApi] = await Promise.all([
        transactionRepository.getTransactions(undefined, 'date_desc'),
        accountRepository.getAccounts(),
        budgetRepository.getBudgets(),
        categoryRepository.getCategories(),
        apiClient.request<any>('/dashboard').catch(() => null),
      ]);

      const totalBalance = calculateTotalBalance(accounts);

      // Current month transactions
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const currentMonthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const { income: totalIncome, expense: totalExpense, netSavings } =
        calculateTotals(currentMonthTransactions);

      const incomeCount = currentMonthTransactions.filter(t => t.type === 'income').length;
      const expenseCount = currentMonthTransactions.filter(t => t.type === 'expense').length;

      const savingsRate =
        totalIncome > 0 ? Math.min(100, Math.max(0, Math.round((netSavings / totalIncome) * 100))) : 0;

      const activeBudgets = budgets.filter(b => b.isActive);
      const monthlyBudget = activeBudgets.reduce((sum, b) => sum + b.amount, 0);
      const monthlyBudgetSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);
      const budgetStatus = calculateBudgetStatus(monthlyBudgetSpent, monthlyBudget);

      const categorySpending = calculateCategorySpending(
        currentMonthTransactions,
        categories,
        'expense'
      );

      const recentTransactions = transactions.slice(0, 5);

      // Real streak from backend API
      const streakDays = dashboardApi?.streak?.current || 0;
      const longestStreak = dashboardApi?.streak?.longest || 0;

      return {
        totalBalance,
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate,
        streakDays,
        longestStreak,
        incomeCount,
        expenseCount,
        monthlyBudget,
        monthlyBudgetSpent,
        budgetStatus,
        recentTransactions,
        categorySpending,
        topBudgets: activeBudgets.slice(0, 4),
      };
    },
  });
}

