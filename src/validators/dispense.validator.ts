import { z } from 'zod';

export const startDispenseSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('Quantity must be a positive integer'),
  }),
});

export const completeDispenseSchema = z.object({
  body: z.object({
    dispense_id: z.string().uuid('Invalid dispense ID format'),
    status: z.enum(['COMPLETED', 'FAILED', 'completed', 'failed'], {
      errorMap: () => ({ message: 'Status must be COMPLETED or FAILED' }),
    }),
  }),
});

export const isAllowedToDispenseSchema = z.object({
  query: z.object({
    quantity: z.string().transform((val) => parseInt(val, 10)).pipe(
      z.number().int().positive('Quantity must be a positive integer')
    ),
  }),
});

