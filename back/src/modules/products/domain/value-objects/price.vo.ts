import { PriceValidationException } from "@products/domain/exceptions/price-validation.exception";
import { BaseValueObject } from "@shared/domain/value-objects/base.vo";

export class Price extends BaseValueObject<number> {
  protected validate(value: number): void {
    if (value <= 0) {
      throw new PriceValidationException();
    }
  }
}