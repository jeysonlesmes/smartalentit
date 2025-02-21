import { Product } from "@invoices/domain/entities/product.entity";
import { User } from "@invoices/domain/entities/user.entity";
import { InvoiceCreatedEvent } from "@invoices/domain/events/invoice-created.event";
import { AggregateRoot } from "@shared/domain/aggregate/aggregate-root";
import { NumberValueObject } from "@shared/domain/value-objects/number.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class Invoice extends AggregateRoot {
  constructor(
    private _id: Uuid,
    private _products: Product[],
    private _user: User,
    private _total: NumberValueObject,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  static create(
    products: Product[],
    user: User
  ): Invoice {
    const id = Uuid.generate();
    const total = products.reduce((prevValue, product) => prevValue + product.totalPrice.value(), 0);

    const invoice = new Invoice(
      id,
      products,
      user,
      new NumberValueObject(total),
      new Date(),
      new Date()
    );

    invoice.record(
      new InvoiceCreatedEvent(
        'invoice.created',
        {
          id,
          products,
          user,
          total
        }
      )
    );

    return invoice;
  }

  get id(): Uuid {
    return this._id;
  }

  get products(): Product[] {
    return this._products;
  }

  get user(): User {
    return this._user;
  }

  get total(): NumberValueObject {
    return this._total;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}