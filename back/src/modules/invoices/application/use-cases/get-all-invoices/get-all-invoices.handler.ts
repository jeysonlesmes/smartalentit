import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { GetAllInvoicesQuery } from "@invoices/application/use-cases/get-all-invoices/get-all-invoices.query";
import { InvoiceRepository } from "@invoices/domain/repositories/invoice.repository";
import { PaginatedResultDto } from "@shared/application/dtos/paginated-result.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(GetAllInvoicesQuery)
export class GetAllInvoicesHandler implements IRequestHandler<GetAllInvoicesQuery, PaginatedResultDto<InvoiceDto>> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly mapper: Mapper
  ) { }

  async handle({
    pageIndex,
    pageSize,
    userId,
    userName,
    productName,
    minPrice,
    maxPrice,
    startDate,
    endDate
  }: GetAllInvoicesQuery): Promise<PaginatedResultDto<InvoiceDto>> {
    const { items: invoices, total } = await this.invoiceRepository.findPaginated({
      pageIndex,
      pageSize,
      userId,
      userName,
      productName,
      minPrice,
      maxPrice,
      startDate,
      endDate
    });

    return PaginatedResultDto.create(
      this.mapper.mapArray(invoices, InvoiceDto),
      total,
      pageIndex,
      pageSize
    );
  }
}