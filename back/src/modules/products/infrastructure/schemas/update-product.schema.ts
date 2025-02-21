import { z } from 'zod';

export const UpdateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  price: z.number().positive('Price must be a positive number'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  status: z.string()
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;