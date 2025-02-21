import { ProductDto } from "@products/application/dtos/product.dto";
import { UpdateProductCommand } from "@products/application/use-cases/update-product/update-product.command";
import { Product } from "@products/domain/entities/product.entity";
import { Status } from "@products/domain/entities/status.entity";
import { ProductNotFoundException } from "@products/domain/exceptions/product-not-found.exception";
import { StatusNotFoundException } from "@products/domain/exceptions/status-not-found.exception";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { StatusRepository } from "@products/domain/repositories/status.repository";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(UpdateProductCommand)
export class UpdateProductHandler implements IRequestHandler<UpdateProductCommand, ProductDto> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly statusRepository: StatusRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly mapper: Mapper
  ) { }

  async handle({ id, name, description, price, stock, status: statusCode }: UpdateProductCommand): Promise<ProductDto> {
    const product = await this.getProduct(id);
    const status = await this.findStatusByCode(statusCode);

    product.update(
      name,
      description,
      price,
      stock,
      status
    );

    await this.productRepository.save(product);

    await this.eventPublisher.publishAll(product.pullEvents());

    return this.mapper.map(product, ProductDto);
  }

  private async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOneById(new ProductId(id));

    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  private async findStatusByCode(code: string): Promise<Status> {
    const status = await this.statusRepository.findOneByCode(code);

    if (!status) {
      throw new StatusNotFoundException(code);
    }

    return status;
  }
}