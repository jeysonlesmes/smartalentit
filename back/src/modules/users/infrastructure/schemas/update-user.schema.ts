import { z } from 'zod';

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .refine(
      (value) => /[A-Z]/.test(value),
      { message: 'Password must include at least one uppercase letter' }
    )
    .refine(
      (value) => /\d/.test(value),
      { message: 'Password must include at least one number' }
    )
    .refine(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      { message: 'Password must include at least one special character' }
    )
    .optional(),
  role: z.string()
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;