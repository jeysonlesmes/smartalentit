import { ValidationException } from "@shared/domain/exceptions/validation.exception";

export class InvalidUUIDException extends ValidationException {
  constructor(uuid: string) {
    super(`Value: ${uuid} is not a valid UUID value.`);
  }
}