import { ProductDto } from "@products/application/dtos/product.dto";
import { CreateProductCommand } from "@products/application/use-cases/create-product/create-product.command";
import { Product } from "@products/domain/entities/product.entity";
import { Status } from "@products/domain/entities/status.entity";
import { StatusNotFoundException } from "@products/domain/exceptions/status-not-found.exception";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { StatusRepository } from "@products/domain/repositories/status.repository";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(CreateProductCommand)
export class CreateProductHandler implements IRequestHandler<CreateProductCommand, ProductDto> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly statusRepository: StatusRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly mapper: Mapper
  ) { }

  async handle({ name, description, price, stock, status: statusCode }: CreateProductCommand): Promise<ProductDto> {
    const status = await this.findStatusByCode(statusCode);

    const product = Product.create(name, description, price, stock, status);

    await this.productRepository.save(product);

    await this.eventPublisher.publishAll(product.pullEvents());

    return this.mapper.map(product, ProductDto);
  }

  private async findStatusByCode(code: string): Promise<Status> {
    const status = await this.statusRepository.findOneByCode(code);

    if (!status) {
      throw new StatusNotFoundException(code);
    }

    return status;
  }
}