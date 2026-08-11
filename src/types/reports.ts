export type ReportPeriod = 'week' | 'month' | 'year' | 'all';

export interface ReportSummary {
  period: ReportPeriod;
  periodStart: string;
  periodEnd: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  previousPeriodExpense?: number;
  expenseChangePercentage?: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  transactionCount: number;
  percentage: number;
}

export interface SpendingTrendPoint {
  label: string;
  date: string;
  income: number;
  expense: number;
}

export interface PaymentMethodSpending {
  accountId: string;
  accountName: string;
  accountType: string;
  amount: number;
  percentage: number;
}
