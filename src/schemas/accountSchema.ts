import { z } from 'zod';

export const accountFormSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  type: z.enum(['cash', 'bank', 'upi', 'credit_card', 'debit_card', 'other']),
  institutionName: z.string().optional(),
  balance: z.number({
    required_error: 'Starting balance is required',
    invalid_type_error: 'Balance must be a number',
  }),
  icon: z.string().min(1, 'Icon is required'),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
