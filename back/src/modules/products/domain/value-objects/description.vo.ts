import { DescriptionValidationException } from "@products/domain/exceptions/description-validation.exception";
import { BaseValueObject } from "@shared/domain/value-objects/base.vo";

export class Description extends BaseValueObject<string> {
  protected validate(value: string): void {
    if (value.length < 10 || value.length > 200) {
      throw new DescriptionValidationException();
    }
  }
}