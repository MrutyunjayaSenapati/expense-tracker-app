import { CurrencyCode, CURRENCIES } from '../types/currency';

export interface FormatCurrencyOptions {
  currency?: CurrencyCode;
  showDecimals?: boolean;
  sign?: boolean;
  type?: 'expense' | 'income' | 'neutral';
}

/**
 * Centralized currency formatting utility.
 * Formats numbers into proper currency strings, respecting Indian number formatting for INR.
 * Example: 12450 -> "₹12,450"
 */
export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = 'INR',
    showDecimals = false,
    sign = false,
    type = 'neutral',
  } = options;

  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const absAmount = Math.abs(amount);

  let formattedNumber: string;

  if (currency === 'INR') {
    // Format using Indian Numbering System (Lakhs, Crores)
    formattedNumber = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: showDecimals ? config.decimalPlaces : 0,
      maximumFractionDigits: showDecimals ? config.decimalPlaces : 0,
    }).format(absAmount);
  } else {
    formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: showDecimals ? config.decimalPlaces : 0,
      maximumFractionDigits: showDecimals ? config.decimalPlaces : 0,
    }).format(absAmount);
  }

  let prefix = '';
  if (sign) {
    if (type === 'expense' || amount < 0) {
      prefix = '-';
    } else if (type === 'income' || amount > 0) {
      prefix = '+';
    }
  }

  return `${prefix}${config.symbol}${formattedNumber}`;
}

export function parseCurrencyInput(value: string): number {
  if (!value) return 0;
  // Strip out currency symbols and commas
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
