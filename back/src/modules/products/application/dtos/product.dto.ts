import { StatusDto } from "@products/application/dtos/status.dto";

export class ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: StatusDto;
  createdAt: Date;
  updatedAt: Date;
}