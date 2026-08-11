import { useQuery } from '@tanstack/react-query';
import {
  transactionRepository,
  accountRepository,
  budgetRepository,
  categoryRepository,
} from '../repositories';
import { DashboardSummary } from '../types/dashboard';
import {
  calculateTotalBalance,
  calculateTotals,
  calculateCategorySpending,
  calculateBudgetStatus,
} from '../utils/calculations';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardSummary> => {
      const [transactions, accounts, budgets, categories] = await Promise.all([
        transactionRepository.getTransactions(undefined, 'date_desc'),
        accountRepository.getAccounts(),
        budgetRepository.getBudgets(),
        categoryRepository.getCategories(),
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

      const relevantTransactions =
        currentMonthTransactions.length > 0 ? currentMonthTransactions : transactions;

      const { income: totalIncome, expense: totalExpense, netSavings } =
        calculateTotals(relevantTransactions);

      const activeBudgets = budgets.filter(b => b.isActive);
      const monthlyBudget = activeBudgets.reduce((sum, b) => sum + b.amount, 0);
      const monthlyBudgetSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);
      const budgetStatus = calculateBudgetStatus(monthlyBudgetSpent, monthlyBudget);

      const categorySpending = calculateCategorySpending(
        relevantTransactions,
        categories,
        'expense'
      );

      const recentTransactions = transactions.slice(0, 5);

      return {
        totalBalance,
        totalIncome,
        totalExpense,
        netSavings,
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
