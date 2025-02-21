import { NumberValueObject } from "@shared/domain/value-objects/number.vo";
import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class Product {
  constructor(
    private _id: Uuid,
    private _name: StringValueObject,
    private _quantity: NumberValueObject,
    private _unitPrice: NumberValueObject,
    private _totalPrice: NumberValueObject
  ) { }

  static create(
    id: string,
    name: string,
    quantity: number,
    price: number
  ): Product {
    return new Product(
      new Uuid(id),
      new StringValueObject(name),
      new NumberValueObject(quantity),
      new NumberValueObject(price),
      new NumberValueObject(quantity * price)
    );
  }

  get id(): Uuid {
    return this._id;
  }

  get name(): StringValueObject {
    return this._name;
  }

  get quantity(): NumberValueObject {
    return this._quantity;
  }

  get unitPrice(): NumberValueObject {
    return this._unitPrice;
  }

  get totalPrice(): NumberValueObject {
    return this._totalPrice;
  }
}