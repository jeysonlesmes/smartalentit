import { DomainEvent } from "@shared/domain/bus/domain.event";

export abstract class EventPublisher {
  abstract publish(event: DomainEvent): Promise<void>;
  
  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
