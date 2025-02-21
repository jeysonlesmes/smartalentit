import { UserDto } from "@shared/application/dtos/user.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class CreateUserCommand implements IRequest<UserDto> {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string
  ) { }
}