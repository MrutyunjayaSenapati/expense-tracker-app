import { MockTransactionRepository } from '../mock/MockTransactionRepository';

describe('MockTransactionRepository', () => {
  let repo: MockTransactionRepository;

  beforeEach(async () => {
    repo = new MockTransactionRepository();
    await repo.resetToDefault();
  });

  it('retrieves default transactions list', async () => {
    const list = await repo.getTransactions();
    expect(list.length).toBeGreaterThan(0);
  });

  it('filters transactions by type', async () => {
    const expenses = await repo.getTransactions({ type: 'expense' });
    expect(expenses.every(t => t.type === 'expense')).toBe(true);

    const incomes = await repo.getTransactions({ type: 'income' });
    expect(incomes.every(t => t.type === 'income')).toBe(true);
  });

  it('creates and deletes a transaction', async () => {
    const newTxn = await repo.createTransaction({
      type: 'expense',
      amount: 999,
      categoryId: 'cat_food',
      accountId: 'acc_upi',
      date: new Date().toISOString(),
      merchant: 'Test Cafe',
      note: 'Testing creation',
    });

    expect(newTxn.id).toBeDefined();
    expect(newTxn.amount).toBe(999);

    const fetched = await repo.getTransactionById(newTxn.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.merchant).toBe('Test Cafe');

    const deleted = await repo.deleteTransaction(newTxn.id);
    expect(deleted).toBe(true);

    const fetchedAfter = await repo.getTransactionById(newTxn.id);
    expect(fetchedAfter).toBeNull();
  });
});
