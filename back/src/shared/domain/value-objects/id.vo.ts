import { BaseValueObject } from "@shared/domain/value-objects/base.vo";

export abstract class Id<T = string> extends BaseValueObject<T> { }