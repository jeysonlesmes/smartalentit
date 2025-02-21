import { Status as Domain } from "@products/domain/entities/status.entity"
import { Status as Persistence } from "@products/infrastructure/persistence/mysql/entities/status.entity"
import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class StatusMapper {
  static toDomain(entity: Persistence): Domain {
    return new Domain(
      new Uuid(entity.id),
      new StringValueObject(entity.code),
      new StringValueObject(entity.name)
    );
  }

  static toPersistence(entity: Domain): Partial<Persistence> {
    return {
      id: entity.id.value(),
      code: entity.code.value(),
      name: entity.name.value(),
    }
  }
}