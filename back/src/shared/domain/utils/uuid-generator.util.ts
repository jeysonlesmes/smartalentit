import { v4 as uuid, validate } from 'uuid';

export class UuidGenerator {
  public static generate(): string {
    return uuid();
  }

  public static validate(uuid: string): boolean {
    return validate(uuid);
  }
}