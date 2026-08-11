import { z } from 'zod';

export const transactionFormSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be greater than 0'),
  categoryId: z.string({
    required_error: 'Category is required',
  }).min(1, 'Category is required'),
  accountId: z.string({
    required_error: 'Account is required',
  }).min(1, 'Account is required'),
  date: z.string({
    required_error: 'Date is required',
  }).min(1, 'Date is required'),
  merchant: z.string().optional(),
  note: z.string().optional(),
  receiptUri: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
