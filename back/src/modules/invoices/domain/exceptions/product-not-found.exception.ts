import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class ProductNotFoundException extends BusinessException {
  constructor(id: string) {
    super(`Product ID: ${id} not found`);
  }
}