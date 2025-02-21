import { ProductDto } from "@products/application/dtos/product.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class CreateProductCommand implements IRequest<ProductDto> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly status: string
  ) {
  }
}