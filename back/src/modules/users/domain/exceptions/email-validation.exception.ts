import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class InvalidEmailException extends ValidationException {
  constructor() {
    super("Invalid email.");
  }
}