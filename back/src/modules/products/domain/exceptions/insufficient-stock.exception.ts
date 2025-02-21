import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class InsufficientStockException extends ValidationException {
  constructor() {
    super("Insufficient stock.");
  }
}