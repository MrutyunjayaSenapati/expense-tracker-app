import { useQuery } from '@tanstack/react-query';
import {
  transactionRepository,
  categoryRepository,
  accountRepository,
} from '../repositories';
import {
  ReportPeriod,
  ReportSummary,
  CategorySpending,
  SpendingTrendPoint,
  PaymentMethodSpending,
} from '../types/reports';
import {
  calculateTotals,
  calculateCategorySpending,
  generateSpendingTrend,
} from '../utils/calculations';

export interface ReportDataResult {
  summary: ReportSummary;
  categoryBreakdown: CategorySpending[];
  incomeCategories: CategorySpending[];
  spendingTrend: SpendingTrendPoint[];
  paymentMethodBreakdown: PaymentMethodSpending[];
}

export function useReportData(period: ReportPeriod = 'month') {
  return useQuery({
    queryKey: ['reports', period],
    queryFn: async (): Promise<ReportDataResult> => {
      const [allTransactions, categories, accounts] = await Promise.all([
        transactionRepository.getTransactions(undefined, 'date_desc'),
        categoryRepository.getCategories(),
        accountRepository.getAccounts(),
      ]);

      const now = new Date();
      let filtered = [...allTransactions];
      let previousPeriodFiltered = [...allTransactions];

      if (period === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const twoWeeksAgo = new Date(now);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        filtered = allTransactions.filter(
          t => new Date(t.date).getTime() >= weekAgo.getTime()
        );
        previousPeriodFiltered = allTransactions.filter(
          t =>
            new Date(t.date).getTime() >= twoWeeksAgo.getTime() &&
            new Date(t.date).getTime() < weekAgo.getTime()
        );
      } else if (period === 'month') {
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        filtered = allTransactions.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        });
        previousPeriodFiltered = allTransactions.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
        });
      } else if (period === 'year') {
        const currentYear = now.getFullYear();
        const prevYear = currentYear - 1;

        filtered = allTransactions.filter(t => new Date(t.date).getFullYear() === currentYear);
        previousPeriodFiltered = allTransactions.filter(t => new Date(t.date).getFullYear() === prevYear);
      }

      const { income, expense, netSavings } = calculateTotals(filtered);
      const { expense: prevExpense } = calculateTotals(previousPeriodFiltered);

      const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;
      const expenseChange =
        prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 100) : 0;

      const categoryBreakdown = calculateCategorySpending(filtered, categories, 'expense');
      const incomeCategories = calculateCategorySpending(filtered, categories, 'income');
      const spendingTrend = generateSpendingTrend(filtered);

      // Payment method breakdown
      const expenseTransactions = filtered.filter(t => t.type === 'expense');
      const totalExpense = expenseTransactions.reduce((s, t) => s + t.amount, 0);
      const accountMap = new Map<string, number>();

      for (const txn of expenseTransactions) {
        accountMap.set(txn.accountId, (accountMap.get(txn.accountId) || 0) + txn.amount);
      }

      const accountLookup = new Map(accounts.map(a => [a.id, a]));
      const paymentMethodBreakdown: PaymentMethodSpending[] = [];

      for (const [accountId, amount] of accountMap.entries()) {
        const acc = accountLookup.get(accountId);
        const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
        paymentMethodBreakdown.push({
          accountId,
          accountName: acc?.name ?? 'Unknown',
          accountType: acc?.type ?? 'other',
          amount,
          percentage,
        });
      }

      paymentMethodBreakdown.sort((a, b) => b.amount - a.amount);

      return {
        summary: {
          period,
          periodStart: filtered[filtered.length - 1]?.date ?? now.toISOString(),
          periodEnd: filtered[0]?.date ?? now.toISOString(),
          totalIncome: income,
          totalExpense: expense,
          netSavings,
          savingsRate,
          previousPeriodExpense: prevExpense,
          expenseChangePercentage: expenseChange,
        },
        categoryBreakdown,
        incomeCategories,
        spendingTrend,
        paymentMethodBreakdown,
      };
    },
  });
}
