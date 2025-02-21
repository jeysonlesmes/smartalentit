import { Invoice } from "@invoices/domain/entities/invoice.entity";
import { ProductMapper } from "@invoices/infrastructure/persistence/mongo-db/mappers/product.mapper";
import { UserMapper } from "@invoices/infrastructure/persistence/mongo-db/mappers/user.mapper";
import { InvoiceDocument } from "@invoices/infrastructure/persistence/mongo-db/schemas/invoice.schema";
import { NumberValueObject } from "@shared/domain/value-objects/number.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class InvoiceMapper {
  static toDomain(persistence: InvoiceDocument): Invoice {
    return new Invoice(
      new Uuid(persistence.invoiceId),
      persistence.products.map(ProductMapper.toDomain),
      UserMapper.toDomain(persistence.user),
      new NumberValueObject(persistence.total),
      persistence.createdAt,
      persistence.updatedAt
    );
  }

  static toPersistence(entity: Invoice): InvoiceDocument {
    return {
      invoiceId: entity.id.value(),
      products: entity.products.map(ProductMapper.toPersistence),
      user: UserMapper.toPersistence(entity.user),
      total: entity.total.value(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    } as InvoiceDocument;
  }
}