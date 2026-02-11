import { z } from 'zod';

export const bankSchema = z.object({
  accountHolderName: z
    .string()
    .min(2, 'Account holder name is required'),

  accountNumber: z
    .string()
    .regex(/^\d{9,18}$/, 'Account number must be 9–18 digits'),

  ifscCode: z
    .string()
    .regex(
      /^[A-Z]{4}0[A-Z0-9]{6}$/,
      'Invalid IFSC code format'
    ),

  bankName: z
    .string()
    .min(2, 'Bank name is required'),

  upiId: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || /^[\w.-]+@[\w.-]+$/.test(val),
      {
        message: 'Invalid UPI ID',
      }
    ),
});

export type BankFormValues = z.infer<typeof bankSchema>;
