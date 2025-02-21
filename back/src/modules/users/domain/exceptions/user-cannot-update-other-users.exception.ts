import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class UserCannotUpdateOtherUsersException extends BusinessException {
  constructor() {
    super("User can't update other users");
  }
}