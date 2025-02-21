import { BusinessException } from "@shared/domain/exceptions/business.exception";

export class ProductDuplicatedException extends BusinessException {
  constructor(id: string) {
    super(`Product with ID: ${id} is duplicated in the invoice`);
  }
}