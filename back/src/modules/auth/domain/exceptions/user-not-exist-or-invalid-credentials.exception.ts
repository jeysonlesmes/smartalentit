import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class UserNotExistOrInvalidCredentialsException extends BusinessException {
  constructor() {
    super("User not exist or invalid credentials");
  }
}