export abstract class BaseValueObject<T = string> {
  constructor(private _value: T) {
    this.validate(_value);
  }

  public value(): T {
    return this._value;
  }

  protected abstract validate(value: T): void;
}