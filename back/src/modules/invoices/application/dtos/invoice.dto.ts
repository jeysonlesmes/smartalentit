import { InvoiceProductDto } from "@invoices/application/dtos/invoice-product.dto";
import { InvoiceUserDto } from "@invoices/application/dtos/invoice-user.dto";

export class InvoiceDto {
  id: string;
  products: InvoiceProductDto[];
  user: InvoiceUserDto;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}