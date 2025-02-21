import { Product } from "@invoices/domain/entities/product.entity";
import { Product as ProductDocument } from "@invoices/infrastructure/persistence/mongo-db/schemas/product.schema";
import { NumberValueObject } from "@shared/domain/value-objects/number.vo";
import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class ProductMapper {
  static toDomain(persistence: ProductDocument): Product {
    return new Product(
      new Uuid(persistence.id),
      new StringValueObject(persistence.name),
      new NumberValueObject(persistence.quantity),
      new NumberValueObject(persistence.unitPrice),
      new NumberValueObject(persistence.totalPrice)
    );
  }

  static toPersistence(entity: Product): ProductDocument {
    return {
      id: entity.id.value(),
      name: entity.name.value(),
      quantity: entity.quantity.value(),
      unitPrice: entity.unitPrice.value(),
      totalPrice: entity.totalPrice.value()
    } as ProductDocument;
  }
}