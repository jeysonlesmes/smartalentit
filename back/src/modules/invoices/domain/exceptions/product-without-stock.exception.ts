import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class ProductWithoutStockException extends BusinessException {
  constructor(id: string) {
    super(`Product with ID: ${id} does not have enough stock`);
  }
}