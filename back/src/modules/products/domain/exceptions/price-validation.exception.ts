import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class PriceValidationException extends ValidationException {
  constructor() {
    super("Price must be greater than zero.");
  }
}