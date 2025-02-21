import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { ProductQuantityDto } from "@invoices/application/dtos/product-quantity.dto";
import { CreateInvoiceCommand } from "@invoices/application/use-cases/create-invoice/create-invoice.command";
import { Invoice } from "@invoices/domain/entities/invoice.entity";
import { Product } from "@invoices/domain/entities/product.entity";
import { User } from "@invoices/domain/entities/user.entity";
import { ProductDuplicatedException } from "@invoices/domain/exceptions/product-duplicated.exception";
import { ProductNotActiveException } from "@invoices/domain/exceptions/product-not-active.exception";
import { ProductNotFoundException } from "@invoices/domain/exceptions/product-not-found.exception";
import { ProductWithoutStockException } from "@invoices/domain/exceptions/product-without-stock.exception";
import { InvoiceRepository } from "@invoices/domain/repositories/invoice.repository";
import { ProductDto } from "@products/application/dtos/product.dto";
import { GetProductByIdQuery } from "@products/application/use-cases/get-product-by-id/get-product-by-id.query";
import { UpdateProductCommand } from "@products/application/use-cases/update-product/update-product.command";
import { CommandQueryBus, IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(CreateInvoiceCommand)
export class CreateInvoiceHandler implements IRequestHandler<CreateInvoiceCommand, InvoiceDto> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly commandQueryBus: CommandQueryBus,
    private readonly eventPublisher: EventPublisher,
    private readonly mapper: Mapper
  ) { }

  async handle(request: CreateInvoiceCommand): Promise<InvoiceDto> {
    const baseProducts = await this.getBaseProducts(request.products);

    const invoice = await this.getInvoice({ request, baseProducts });

    await this.invoiceRepository.save(invoice);

    await this.updateProducts({ request, baseProducts });

    await this.eventPublisher.publishAll(invoice.pullEvents());

    return this.mapper.map(invoice, InvoiceDto);
  }

  private async getInvoice({ request, baseProducts }: { request: CreateInvoiceCommand; baseProducts: ProductDto[]; }): Promise<Invoice> {
    const products = await this.getProducts({ request, baseProducts });
    const user = User.create(request.user.id, request.user.name, request.user.email);

    return Invoice.create(
      products,
      user
    );
  }

  private async updateProducts({ request, baseProducts }: { request: CreateInvoiceCommand; baseProducts: ProductDto[]; }): Promise<void> {
    await Promise.all(
      request.products.map(({ id, quantity }) => {
        const { name, description, price, stock, status } = baseProducts.find(_product => _product.id === id);

        return this.commandQueryBus.send(
          new UpdateProductCommand(
            id,
            name,
            description,
            price,
            this.getNewStock({ currentStock: stock, quantity }),
            status.code
          )
        );
      })
    );
  }

  private getProducts({ request, baseProducts }: { request: CreateInvoiceCommand; baseProducts: ProductDto[]; }): Promise<Product[]> {
    return Promise.all(
      request.products.map(product => this.getProduct({ product, baseProducts }))
    );
  }

  private getProduct({ product: { id, quantity }, baseProducts }: { product: ProductQuantityDto; baseProducts: ProductDto[]; }): Product {
    const product = baseProducts.find(_product => _product.id === id);

    return Product.create(
      id,
      product.name,
      quantity,
      product.price
    );
  }

  private getBaseProducts(products: ProductQuantityDto[]): Promise<ProductDto[]> {
    this.validateUniqueProducts(products);

    return Promise.all(
      products.map(product => this.getBaseProduct(product))
    );
  }

  private async getBaseProduct({ id, quantity }: ProductQuantityDto): Promise<ProductDto> {
    const product = await this.commandQueryBus.send<GetProductByIdQuery, ProductDto>(
      new GetProductByIdQuery(id)
    );

    this.ensureProductIsAvailable({ id, product, quantity });

    return product;
  }

  private ensureProductIsAvailable({ id, product, quantity }: { id: string; product: ProductDto | null; quantity: number; }): void {
    if (!product) {
      throw new ProductNotFoundException(id);
    }

    if (product.status.code !== 'active') {
      throw new ProductNotActiveException(product.id);
    }

    if (this.getNewStock({ currentStock: product.stock, quantity }) < 0) {
      throw new ProductWithoutStockException(product.id);
    }
  }

  private getNewStock({ currentStock, quantity }: { currentStock: number; quantity: number; }): number {
    return currentStock - quantity;
  }

  private validateUniqueProducts(products: ProductQuantityDto[]): void {
    const ids = new Set();

    for (const product of products) {
      if (ids.has(product.id)) {
        throw new ProductDuplicatedException(product.id);
      }

      ids.add(product.id);
    }
  }
}