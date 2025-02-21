import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class Role {
  constructor(
    private _id: Uuid,
    private _code: StringValueObject
  ) { }

  get id(): Uuid {
    return this._id;
  }

  get code(): StringValueObject {
    return this._code;
  }
}