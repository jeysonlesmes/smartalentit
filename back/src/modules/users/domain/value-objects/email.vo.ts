import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { InvalidEmailException } from "@users/domain/exceptions/email-validation.exception";

export class Email extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
      throw new InvalidEmailException();
    }
  }
}