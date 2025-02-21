import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class DescriptionValidationException extends ValidationException {
  constructor() {
    super("Description must be between 10 and 200 characters.");
  }
}