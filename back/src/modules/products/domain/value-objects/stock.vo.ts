import { InsufficientStockException } from "@products/domain/exceptions/insufficient-stock.exception";
import { InvalidQuantityToAddException } from "@products/domain/exceptions/invalid-quantity-to-add.exception";
import { NegativeStockException } from "@products/domain/exceptions/negative-stock.exception";
import { BaseValueObject } from "@shared/domain/value-objects/base.vo";

export class Stock extends BaseValueObject<number> {
  add(quantity: number): Stock {
    if (quantity <= 0) {
      throw new InvalidQuantityToAddException();
    }

    return new Stock(this.value() + quantity);
  }

  subtract(quantity: number): Stock {
    if (quantity > this.value()) {
      throw new InsufficientStockException();
    }

    return new Stock(this.value() - quantity);
  }

  protected validate(value: number): void {
    if (value < 0) {
      throw new NegativeStockException();
    }
  }
}
