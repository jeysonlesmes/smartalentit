import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { Role } from "@users/domain/entities/role.entity";
import { Role as RoleDocument } from "@users/infrastructure/persistence/mongo-db/schemas/role.schema";

export class RoleMapper {
  static toDomain(persistence: RoleDocument): Role {
    return new Role(
      new Uuid(persistence.id),
      new StringValueObject(persistence.code)
    );
  }

  static toPersistence(entity: Role): RoleDocument {
    return {
      id: entity.id.value(),
      code: entity.code.value()
    } as RoleDocument;
  }
}