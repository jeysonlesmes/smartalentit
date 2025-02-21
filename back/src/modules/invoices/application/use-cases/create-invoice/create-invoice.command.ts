import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { ProductQuantityDto } from "@invoices/application/dtos/product-quantity.dto";
import { UserDto } from "@shared/application/dtos/user.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class CreateInvoiceCommand implements IRequest<InvoiceDto> {
  constructor(
    public readonly user: UserDto,
    public readonly products: ProductQuantityDto[]
  ) { }
}