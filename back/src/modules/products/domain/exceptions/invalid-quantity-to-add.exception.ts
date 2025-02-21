import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class InvalidQuantityToAddException extends ValidationException {
  constructor() {
    super("Quantity to add must be greater than zero.");
  }
}