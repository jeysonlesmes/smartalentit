import { Product } from "@products/domain/entities/product.entity";
import { Description } from "@products/domain/value-objects/description.vo";
import { Name } from "@products/domain/value-objects/name.vo";
import { Price } from "@products/domain/value-objects/price.vo";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { Stock } from "@products/domain/value-objects/stock.vo";
import { Product as ProductEntity } from "@products/infrastructure/persistence/mysql/entities/product.entity";
import { StatusMapper } from "@products/infrastructure/persistence/mysql/mappers/status.mapper";

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    return new Product(
      new ProductId(entity.id),
      new Name(entity.name),
      new Description(entity.description),
      new Price(entity.price),
      new Stock(entity.stock),
      StatusMapper.toDomain(entity.status),
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toPersistence(entity: Product): Partial<ProductEntity> {
    return {
      id: entity.id.value(),
      name: entity.name.value(),
      description: entity.description.value(),
      price: entity.price.value(),
      stock: entity.stock.value(),
      statusId: entity.status.id.value(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}