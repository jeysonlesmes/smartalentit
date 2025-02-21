import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";
import { UserDto } from "@shared/application/dtos/user.dto";

export class UpdateUserCommand implements IRequest<UserDto> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string,
    public readonly authenticatedUser: UserDto
  ) { }
}