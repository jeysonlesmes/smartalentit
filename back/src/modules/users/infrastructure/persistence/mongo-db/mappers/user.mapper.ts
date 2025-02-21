import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { User } from "@users/domain/entities/user.entity";
import { Email } from "@users/domain/value-objects/email.vo";
import { RoleMapper } from "@users/infrastructure/persistence/mongo-db/mappers/role.mapper";
import { UserDocument } from "@users/infrastructure/persistence/mongo-db/schemas/user.schema";

export class UserMapper {
  static toDomain(persistence: UserDocument): User {
    return new User(
      new Uuid(persistence.userId),
      new StringValueObject(persistence.name),
      new Email(persistence.email),
      new StringValueObject(persistence.password),
      RoleMapper.toDomain(persistence.role),
      persistence.createdAt,
      persistence.updatedAt
    );
  }

  static toPersistence(entity: User): UserDocument {
    return {
      userId: entity.id.value(),
      name: entity.name.value(),
      email: entity.email.value(),
      password: entity.password.value(),
      role: RoleMapper.toPersistence(entity.role),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    } as UserDocument;
  }
}