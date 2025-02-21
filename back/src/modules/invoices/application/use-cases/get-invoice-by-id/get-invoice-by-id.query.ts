import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetInvoiceByIdQuery implements IRequest<InvoiceDto> {
  constructor(
    public id: string
  ) { }
}