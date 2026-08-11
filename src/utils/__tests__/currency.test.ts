import { formatCurrency, parseCurrencyInput } from '../currency';

describe('currency utils', () => {
  it('formats INR currency correctly without decimals', () => {
    expect(formatCurrency(12450)).toBe('₹12,450');
    expect(formatCurrency(350)).toBe('₹350');
    expect(formatCurrency(0)).toBe('₹0');
    expect(formatCurrency(100000)).toBe('₹1,00,000');
  });

  it('formats with sign and type correctly', () => {
    expect(formatCurrency(350, { sign: true, type: 'expense' })).toBe('-₹350');
    expect(formatCurrency(50000, { sign: true, type: 'income' })).toBe('+₹50,000');
  });

  it('parses currency input numbers correctly', () => {
    expect(parseCurrencyInput('₹12,450')).toBe(12450);
    expect(parseCurrencyInput('350.50')).toBe(350.5);
    expect(parseCurrencyInput('')).toBe(0);
  });
});
