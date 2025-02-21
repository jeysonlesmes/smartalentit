import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class NameLengthValidationException extends ValidationException {
  constructor() {
    super("Name must be between 3 and 100 characters.");
  }
}