import { ProductDto } from "@products/application/dtos/product.dto";
import { GetProductByIdQuery } from "@products/application/use-cases/get-product-by-id/get-product-by-id.query";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(GetProductByIdQuery)
export class GetProductByIdHandler implements IRequestHandler<GetProductByIdQuery, ProductDto> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly mapper: Mapper
  ) { }

  async handle(request: GetProductByIdQuery): Promise<ProductDto> {
    const product = await this.productRepository.findOneById(new ProductId(request.id));

    if (!product) {
      return null;
    }

    return this.mapper.map(product, ProductDto);
  }
}