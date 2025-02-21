import { DomainEvent } from "@shared/domain/bus/domain.event";

export abstract class AggregateRoot {
  private _events: DomainEvent[] = [];

  public pullEvents(): DomainEvent[] {
    const events = this._events;

    this._events = [];

    return events;
  }

  protected record(event: DomainEvent): void {
    this._events.push(event);
  }
}