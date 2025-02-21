import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class NegativeStockException extends ValidationException {
  constructor() {
    super("Stock cannot be negative.");
  }
}