import { BusinessException } from "./business.exception";

export class ValidationException extends BusinessException {
  constructor(message: string) {
    super(message);
  }
}