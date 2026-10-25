import { z } from 'zod';

export const createLoanSchema = z.object({
  friendName: z
    .string({ required_error: 'Friend name is required' })
    .trim()
    .min(1, 'Friend name cannot be empty')
    .max(100, 'Friend name is too long'),
  amount: z
    .union([z.number(), z.string()])
    .transform((val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return num;
    })
    .pipe(
      z
        .number({ required_error: 'Amount is required' })
        .positive('Amount must be greater than 0')
        .max(100000000, 'Amount is too high')
    ),
  dueDate: z
    .string({ required_error: 'Due date is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Due date must be a valid ISO date string',
    }),
  receiptUrl: z.string().optional().nullable(),
});

export const repayLoanParamSchema = z.object({
  id: z.string().min(1, 'Loan ID is required'),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;
