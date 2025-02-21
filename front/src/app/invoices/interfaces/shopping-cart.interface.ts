import { Product as BaseProduct } from "../../products/interfaces/product.interface";

export interface ShoppingCart {
  products: Record<string, Product>;
}

export interface Product extends BaseProduct {
  quantity: number;
}