import { z } from 'zod';

export const scanLoginSchema = z.object({
  body: z.object({
    scan_code: z.string().min(1, 'QR code is required'),
  }),
});

export const logoutSchema = z.object({
  headers: z.object({
    authorization: z.string().min(1, 'Authorization header is required'),
  }),
});

