import { Status } from "./status.interface";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}