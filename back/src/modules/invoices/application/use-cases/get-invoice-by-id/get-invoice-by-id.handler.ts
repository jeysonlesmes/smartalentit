import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { GetInvoiceByIdQuery } from "@invoices/application/use-cases/get-invoice-by-id/get-invoice-by-id.query";
import { InvoiceRepository } from "@invoices/domain/repositories/invoice.repository";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(GetInvoiceByIdQuery)
export class GetInvoiceByIdHandler implements IRequestHandler<GetInvoiceByIdQuery, InvoiceDto> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly mapper: Mapper
  ) { }

  async handle(request: GetInvoiceByIdQuery): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOneById(new Uuid(request.id));

    if (!invoice) {
      return null;
    }

    return this.mapper.map(invoice, InvoiceDto);
  }

}