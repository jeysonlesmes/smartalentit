import { z } from 'zod';

export const CreateUserSchema = z.object({
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
    ),
  passwordConfirmation: z.string(),
  role: z.string()
})
  .refine(
    data => data.password === data.passwordConfirmation,
    {
      message: 'Passwords do not match',
      path: ['passwordConfirmation']
    }
  );

export type CreateUserDto = z.infer<typeof CreateUserSchema>;