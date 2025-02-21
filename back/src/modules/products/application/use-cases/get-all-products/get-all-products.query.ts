import { ProductDto } from "@products/application/dtos/product.dto";
import { PaginatedResultDto } from "@shared/application/dtos/paginated-result.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetAllProductsQuery implements IRequest<PaginatedResultDto<ProductDto>> {
  constructor(
    public readonly pageIndex: number,
    public readonly pageSize: number,
    public readonly name?: string,
    public readonly statuses?: string[],
    public readonly minStock?: number,
    public readonly minPrice?: number,
    public readonly maxPrice?: number
  ) { }
}