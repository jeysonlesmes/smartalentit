import { ProductDto } from "@products/application/dtos/product.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetProductByIdQuery implements IRequest<ProductDto> {
  constructor(
    public readonly id: string
  ) {
  }
}