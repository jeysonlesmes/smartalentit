import { UserDto } from "@shared/application/dtos/user.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { PasswordEncryption } from "@shared/application/ports/outbound/password-encryption.port";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { UpdateUserCommand } from "@users/application/use-cases/update-user/update-user.command";
import { Role } from "@users/domain/entities/role.entity";
import { User } from "@users/domain/entities/user.entity";
import { EmailAlreadyInUseException } from "@users/domain/exceptions/email-already-in-use.exception";
import { OnlyAdminsCanUpdateUserRolesException } from "@users/domain/exceptions/only-admins-can-update-user-roles.exception";
import { RoleNotFoundException } from "@users/domain/exceptions/role-not-found.exception";
import { UserCannotUpdateOtherUsersException } from "@users/domain/exceptions/user-cannot-update-other-users.exception";
import { UserNotFoundException } from "@users/domain/exceptions/user-not-found.exception";
import { RoleRepository } from "@users/domain/repositories/role.repository";
import { UserRepository } from "@users/domain/repositories/user.repository";

@CommandQuery(UpdateUserCommand)
export class UpdateUserHandler implements IRequestHandler<UpdateUserCommand, UserDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordEncryption: PasswordEncryption,
    private readonly eventPublisher: EventPublisher,
    private readonly mapper: Mapper
  ) { }

  async handle({ id, name, email, password, role: roleCode, authenticatedUser }: UpdateUserCommand): Promise<UserDto> {
    const user = await this.getUser({ id, authenticatedUser, email, roleCode });
    const role = await this.getRoleByCode(roleCode);

    user.update(name, email, this.getPassword({ user, password }), role);

    await this.userRepository.save(user);

    await this.eventPublisher.publishAll(user.pullEvents());

    return this.mapper.map(user, UserDto);
  }

  private getPassword({ user, password }: { user: User; password: string; }): string {
    if (!password) {
      return user.password.value();
    }

    return this.passwordEncryption.encrypt(password);
  }

  private async getUser({ id, authenticatedUser, email, roleCode }: { id: string; authenticatedUser: UserDto; email: string; roleCode: string; }): Promise<User> {
    const user = await this.ensureUserExists(id);

    this.ensureAuthenticatedUserRules({ user, authenticatedUser, roleCode });

    await this.ensureEmailIsAvailable(email, user);

    return user;
  }

  private async ensureUserExists(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(new Uuid(id));

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  private ensureAuthenticatedUserRules({
    user,
    authenticatedUser,
    roleCode
  }: {
    user: User;
    authenticatedUser: UserDto;
    roleCode: string;
  }): void {
    const isAdmin = authenticatedUser.role.code === "admin";

    if (!isAdmin && authenticatedUser.id !== user.id.value()) {
      throw new UserCannotUpdateOtherUsersException();
    }

    if (!isAdmin && roleCode !== user.role.code.value()) {
      throw new OnlyAdminsCanUpdateUserRolesException();
    }
  }

  private async ensureEmailIsAvailable(email: string, user: User): Promise<void> {
    if (email === user.email.value()) {
      return;
    }

    const foundUser = await this.userRepository.findOneByEmail(email);

    if (foundUser && foundUser.id.value() !== user.id.value()) {
      throw new EmailAlreadyInUseException();
    }
  }

  private async getRoleByCode(roleCode: string): Promise<Role> {
    const role = await this.roleRepository.findOneByCode(roleCode);

    if (!role) {
      throw new RoleNotFoundException();
    }

    return role;
  }
}