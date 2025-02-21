import { Product } from "./shopping-cart.interface";

export interface CreateInvoice {
  products: Array<Pick<Product, 'id' | 'quantity'>>;
}