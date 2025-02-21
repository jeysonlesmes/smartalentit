import { DeleteProductCommand } from "@products/application/use-cases/delete-product/delete-product.command";
import { ProductDeletedEvent } from "@products/domain/events/product-deleted.event";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(DeleteProductCommand)
export class DeleteProductHandler implements IRequestHandler<DeleteProductCommand, void> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventPublisher: EventPublisher
  ) { }

  async handle({ id }: DeleteProductCommand): Promise<void> {
    await this.productRepository.delete(new ProductId(id));

    await this.eventPublisher.publish(
      new ProductDeletedEvent(
        'product.deleted',
        {
          id
        }
      )
    );
  }
}