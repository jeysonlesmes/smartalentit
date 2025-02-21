import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class ProductNotFoundException extends BusinessException {
  constructor() {
    super("Product not found");
  }
}