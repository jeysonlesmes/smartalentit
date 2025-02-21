import { ValueNotDefinedException } from "@shared/domain/exceptions/value-validation.exception";
import { BaseValueObject } from "@shared/domain/value-objects/base.vo";

export class NumberValueObject extends BaseValueObject<number> {
  protected validate(value: number): void {
    if (value === undefined) {
      throw new ValueNotDefinedException();
    }
  }
}