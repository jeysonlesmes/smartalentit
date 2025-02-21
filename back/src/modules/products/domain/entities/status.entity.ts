import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class Status {
  constructor(
    private _id: Uuid,
    private _code: StringValueObject,
    private _name: StringValueObject
  ) {}

  get id(): Uuid {
    return this._id;
  }

  get code(): StringValueObject {
    return this._code;
  }

  get name(): StringValueObject {
    return this._name;
  }
}