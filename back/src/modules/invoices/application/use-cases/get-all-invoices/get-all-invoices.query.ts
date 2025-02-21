import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { PaginatedResultDto } from "@shared/application/dtos/paginated-result.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetAllInvoicesQuery implements IRequest<PaginatedResultDto<InvoiceDto>> {
  constructor(
    public readonly pageIndex: number,
    public readonly pageSize: number,
    public readonly userId: string | null,
    public readonly userName: string | null,
    public readonly productName: string | null,
    public readonly minPrice: number | null,
    public readonly maxPrice: number | null,
    public readonly startDate: Date | null,
    public readonly endDate: Date | null
  ) { }
}