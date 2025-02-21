import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { DomainEvent } from "@shared/domain/bus/domain.event";

export class InMemoryEventPublisher extends EventPublisher {
  private readonly events: DomainEvent[] = [];
  
  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);

    console.log(`Event: ${event.eventName}`)
  }
  
  getPublishedEvents(): DomainEvent[] {
    return this.events;
  }
}