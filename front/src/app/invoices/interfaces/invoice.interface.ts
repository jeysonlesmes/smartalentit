import { Product } from "./product.interface";
import { User } from "./user.interface";

export interface Invoice {
  id: string;
  products: Product[];
  user: User;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}