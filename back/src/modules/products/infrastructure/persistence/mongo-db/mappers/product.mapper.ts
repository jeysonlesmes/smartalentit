import { Product } from "@products/domain/entities/product.entity";
import { Description } from "@products/domain/value-objects/description.vo";
import { Name } from "@products/domain/value-objects/name.vo";
import { Price } from "@products/domain/value-objects/price.vo";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { Stock } from "@products/domain/value-objects/stock.vo";
import { StatusMapper } from "@products/infrastructure/persistence/mongo-db/mappers/status.mapper";
import { ProductDocument } from "@products/infrastructure/persistence/mongo-db/schemas/product.schema";
import { Types } from "mongoose";

export class ProductMapper {
  static toDomain(persistence: ProductDocument): Product {
    return new Product(
      new ProductId(persistence.productId),
      new Name(persistence.name),
      new Description(persistence.description),
      new Price(parseFloat(persistence.price.toString())),
      new Stock(persistence.stock),
      StatusMapper.toDomain(persistence.status),
      persistence.createdAt,
      persistence.updatedAt
    );
  }

  static toPersistence(domain: Product): ProductDocument {
    return {
      productId: domain.id.value(),
      name: domain.name.value(),
      description: domain.description.value(),
      price: new Types.Decimal128(domain.price.value().toString()),
      stock: domain.stock.value(),
      status: StatusMapper.toPersistence(domain.status),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    } as ProductDocument;
  }
}