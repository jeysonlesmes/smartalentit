import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
});

export type LoginDto = z.infer<typeof LoginSchema>;