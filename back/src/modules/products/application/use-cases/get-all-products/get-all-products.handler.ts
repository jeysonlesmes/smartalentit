import { ProductDto } from "@products/application/dtos/product.dto";
import { GetAllProductsQuery } from "@products/application/use-cases/get-all-products/get-all-products.query";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { PaginatedResultDto } from "@shared/application/dtos/paginated-result.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(GetAllProductsQuery)
export class GetAllProductsHandler implements IRequestHandler<GetAllProductsQuery, PaginatedResultDto<ProductDto>> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly mapper: Mapper
  ) { }

  async handle({
    pageIndex,
    pageSize,
    name,
    statuses,
    minStock,
    minPrice,
    maxPrice
  }: GetAllProductsQuery): Promise<PaginatedResultDto<ProductDto>> {
    const { items: products, total } = await this.productRepository.findPaginated({
      pageIndex,
      pageSize,
      name,
      statuses,
      minStock,
      minPrice,
      maxPrice
    });

    return PaginatedResultDto.create(
      this.mapper.mapArray(products, ProductDto),
      total,
      pageIndex,
      pageSize
    );
  }
}