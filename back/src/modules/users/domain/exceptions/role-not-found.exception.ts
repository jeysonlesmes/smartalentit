import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class RoleNotFoundException extends BusinessException {
  constructor() {
    super("Role not found");
  }
}