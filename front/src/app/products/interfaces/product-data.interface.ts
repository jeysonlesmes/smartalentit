
export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
}

export interface UpdateProduct extends ProductData {
  id: string;
}

export type CreateProduct = Required<ProductData>;