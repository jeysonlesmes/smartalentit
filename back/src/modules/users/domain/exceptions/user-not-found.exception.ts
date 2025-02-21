import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class UserNotFoundException extends BusinessException {
  constructor() {
    super("User not found");
  }
}