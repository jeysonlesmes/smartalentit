import { SummaryInvoicesDto } from "@invoices/application/dtos/summary-invoices.dto";
import { GetSummaryInvoicesQuery } from "@invoices/application/use-cases/get-summary-invoices/get-summary-invoices.query";
import { InvoiceRepository } from "@invoices/domain/repositories/invoice.repository";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(GetSummaryInvoicesQuery)
export class GetSummaryInvoicesHandler implements IRequestHandler<GetSummaryInvoicesQuery, SummaryInvoicesDto> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository
  ) { }

  handle(request: GetSummaryInvoicesQuery): Promise<SummaryInvoicesDto> {
    return this.invoiceRepository.getSummaryByUser(request);
  }
}