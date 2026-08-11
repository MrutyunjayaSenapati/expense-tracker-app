import { z } from 'zod';

export const budgetFormSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  amount: z
    .number({
      required_error: 'Budget amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Budget amount must be greater than 0'),
  categoryId: z.string().optional(),
  period: z.enum(['weekly', 'monthly', 'yearly', 'custom']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
