import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive({ message: "Quantity must be a positive integer" })
});

export const CreateInvoiceSchema = z.object({
  products: z.array(ProductSchema).nonempty({ message: "Products array cannot be empty" })
});

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>;