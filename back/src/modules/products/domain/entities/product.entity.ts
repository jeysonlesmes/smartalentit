import { Status } from "@products/domain/entities/status.entity";
import { ProductCreatedEvent } from "@products/domain/events/product-created.event";
import { ProductUpdatedEvent } from "@products/domain/events/product-updated.event";
import { Description } from "@products/domain/value-objects/description.vo";
import { Name } from "@products/domain/value-objects/name.vo";
import { Price } from "@products/domain/value-objects/price.vo";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { Stock } from "@products/domain/value-objects/stock.vo";
import { AggregateRoot } from "@shared/domain/aggregate/aggregate-root";

export class Product extends AggregateRoot {
  constructor(
    private _id: ProductId,
    private _name: Name,
    private _description: Description,
    private _price: Price,
    private _stock: Stock,
    private _status: Status,
    private _createdAt: Date,
    private _updatedAt: Date
  ) {
    super();
  }

  static create(
    name: string,
    description: string,
    price: number,
    stock: number,
    status: Status
  ): Product {
    const id = ProductId.generate();
    const product = new Product(
      id,
      new Name(name),
      new Description(description),
      new Price(price),
      new Stock(stock),
      status,
      new Date(),
      new Date()
    );

    product.record(
      new ProductCreatedEvent(
        'product.created',
        {
          id,
          name,
          description,
          price,
          stock,
          status
        }
      )
    );

    return product;
  }

  update(
    name: string,
    description: string,
    price: number,
    stock: number,
    status: Status
  ): void {
    this._name = new Name(name);
    this._description = new Description(description);
    this._price = new Price(price);
    this._stock = new Stock(stock);
    this._status = status;
    this._updatedAt = new Date();

    this.record(
      new ProductUpdatedEvent(
        'product.updated',
        {
          id: this._id,
          name,
          description,
          price,
          stock,
          status
        }
      )
    );
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): Name {
    return this._name;
  }

  get description(): Description {
    return this._description;
  }

  get price(): Price {
    return this._price;
  }

  get stock(): Stock {
    return this._stock;
  }

  get status(): Status {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}