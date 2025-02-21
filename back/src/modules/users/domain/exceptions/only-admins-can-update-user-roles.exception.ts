import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class OnlyAdminsCanUpdateUserRolesException extends BusinessException {
  constructor() {
    super("Only admins can update user roles");
  }
}