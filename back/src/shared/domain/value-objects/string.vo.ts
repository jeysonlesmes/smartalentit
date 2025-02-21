import { ValueNotDefinedException } from "@shared/domain/exceptions/value-validation.exception";
import { BaseValueObject } from "@shared/domain/value-objects/base.vo";

export class StringValueObject extends BaseValueObject<string> {
  protected validate(value: string): void {
    if (value === undefined) {
      throw new ValueNotDefinedException();
    }
  }
}