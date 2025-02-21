import { SummaryInvoicesDto } from "@invoices/application/dtos/summary-invoices.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetSummaryInvoicesQuery implements IRequest<SummaryInvoicesDto> {
  constructor(
    public userId: string,
    public startDate: Date,
    public endDate: Date
  ) { }
}