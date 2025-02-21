import { NameLengthValidationException } from "@products/domain/exceptions/name-validation.exception";
import { BaseValueObject } from "@shared/domain/value-objects/base.vo";

export class Name extends BaseValueObject<string> {
  protected validate(value: string): void {
    if (value.length < 2 || value.length > 100) {
      throw new NameLengthValidationException();
    }
  }
}