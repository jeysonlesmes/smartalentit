import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class StatusNotFoundException extends BusinessException {
  constructor(statusCode: string) {
    super(`Status with code: ${statusCode} not found`);
  }
}