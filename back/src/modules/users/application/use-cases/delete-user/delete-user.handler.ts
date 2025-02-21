import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { DeleteUserCommand } from "@users/application/use-cases/delete-user/delete-user.command";
import { UserDeletedEvent } from "@users/domain/events/user-deleted.event";
import { UserRepository } from "@users/domain/repositories/user.repository";

@CommandQuery(DeleteUserCommand)
export class DeleteUserHandler implements IRequestHandler<DeleteUserCommand, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher
  ) { }

  async handle({ id }: DeleteUserCommand): Promise<void> {
    await this.userRepository.delete(new Uuid(id));

    await this.eventPublisher.publish(
      new UserDeletedEvent(
        'user.deleted',
        {
          id
        }
      )
    );
  }
}