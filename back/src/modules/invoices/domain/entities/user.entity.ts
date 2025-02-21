import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class User {
  constructor(
    private _id: Uuid,
    private _name: StringValueObject,
    private _email: StringValueObject
  ) { }

  static create(
    id: string,
    name: string,
    email: string
  ): User {
    return new User(
      new Uuid(id),
      new StringValueObject(name),
      new StringValueObject(email)
    );
  }

  get id(): Uuid {
    return this._id;
  }

  get name(): StringValueObject {
    return this._name;
  }

  get email(): StringValueObject {
    return this._email;
  }
}