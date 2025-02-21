import { UserDto } from "@shared/application/dtos/user.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { PasswordEncryption } from "@shared/application/ports/outbound/password-encryption.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { CreateUserCommand } from "@users/application/use-cases/create-user/create-user.command";
import { Role } from "@users/domain/entities/role.entity";
import { User } from "@users/domain/entities/user.entity";
import { EmailAlreadyInUseException } from "@users/domain/exceptions/email-already-in-use.exception";
import { RoleNotFoundException } from "@users/domain/exceptions/role-not-found.exception";
import { RoleRepository } from "@users/domain/repositories/role.repository";
import { UserRepository } from "@users/domain/repositories/user.repository";

@CommandQuery(CreateUserCommand)
export class CreateUserHandler implements IRequestHandler<CreateUserCommand, UserDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordEncryption: PasswordEncryption,
    private readonly eventPublisher: EventPublisher,
    private readonly mapper: Mapper
  ) { }

  async handle({ name, email, password, role: roleCode }: CreateUserCommand): Promise<UserDto> {
    await this.ensureEmailIsAvailable(email);

    const role = await this.findRoleByCode(roleCode);
    const user = User.create(name, email, this.passwordEncryption.encrypt(password), role);

    await this.userRepository.save(user);

    await this.eventPublisher.publishAll(user.pullEvents());

    return this.mapper.map(user, UserDto);
  }

  private async findRoleByCode(roleCode: string): Promise<Role> {
    const role = await this.roleRepository.findOneByCode(roleCode);

    if (!role) {
      throw new RoleNotFoundException();
    }

    return role;
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const user = await this.userRepository.findOneByEmail(email);

    if (user) {
      throw new EmailAlreadyInUseException();
    }
  }
}