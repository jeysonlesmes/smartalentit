import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class EmailAlreadyInUseException extends BusinessException {
  constructor() {
    super("Email is already in use");
  }
}