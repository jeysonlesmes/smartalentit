import { User } from "@invoices/domain/entities/user.entity";
import { User as UserDocument } from "@invoices/infrastructure/persistence/mongo-db/schemas/user.schema";
import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class UserMapper {
  static toDomain(persistence: UserDocument): User {
    return new User(
      new Uuid(persistence.id),
      new StringValueObject(persistence.name),
      new StringValueObject(persistence.email)
    );
  }

  static toPersistence(entity: User): UserDocument {
    return {
      id: entity.id.value(),
      name: entity.name.value(),
      email: entity.email.value()
    } as UserDocument;
  }
}