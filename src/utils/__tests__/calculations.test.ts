import {
  calculateBudgetStatus,
  calculateBudgetPercentage,
  calculateTotals,
} from '../calculations';
import { Transaction } from '../../types/transaction';

describe('calculations utils', () => {
  it('calculates budget status accurately based on threshold', () => {
    expect(calculateBudgetStatus(3000, 10000)).toBe('healthy');
    expect(calculateBudgetStatus(8500, 10000)).toBe('warning');
    expect(calculateBudgetStatus(10500, 10000)).toBe('exceeded');
  });

  it('calculates budget percentage correctly', () => {
    expect(calculateBudgetPercentage(5000, 10000)).toBe(50);
    expect(calculateBudgetPercentage(8450, 12000)).toBe(70);
    expect(calculateBudgetPercentage(0, 10000)).toBe(0);
  });

  it('calculates income and expense totals correctly', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 50000,
        categoryId: 'cat_salary',
        accountId: 'acc_1',
        date: '2026-08-01',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        type: 'expense',
        amount: 350,
        categoryId: 'cat_food',
        accountId: 'acc_2',
        date: '2026-08-02',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '3',
        type: 'expense',
        amount: 1200,
        categoryId: 'cat_bills',
        accountId: 'acc_1',
        date: '2026-08-03',
        createdAt: '',
        updatedAt: '',
      },
    ];

    const result = calculateTotals(transactions);
    expect(result.income).toBe(50000);
    expect(result.expense).toBe(1550);
    expect(result.netSavings).toBe(48450);
  });
});
