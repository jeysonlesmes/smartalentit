import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class ProductNotActiveException extends BusinessException {
  constructor(id: string) {
    super(`Product with ID: ${id} is not active, therefore it cannot be added to an invoice.`);
  }
}