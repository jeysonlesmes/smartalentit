export class DomainEvent<T = object> {
  constructor(
    public readonly eventName: string,
    public readonly payload: T,
    public readonly occurredAt?: Date
  ) {}
}