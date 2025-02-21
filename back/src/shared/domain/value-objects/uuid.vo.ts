import { InvalidUUIDException } from "@shared/domain/exceptions/invalid-uuid.exception";
import { UuidGenerator } from "@shared/domain/utils/uuid-generator.util";
import { Id } from "@shared/domain/value-objects/id.vo";

export class Uuid extends Id<string> {
  public static generate(): Uuid {
    return new Uuid(UuidGenerator.generate());
  }

  protected validate(uuid: string): void {
    if (!UuidGenerator.validate(uuid)) {
      throw new InvalidUUIDException(uuid);
    }
  }
}