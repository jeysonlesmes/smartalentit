import { UserWithPasswordDto } from "@shared/application/dtos/user-with-password.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetUserByEmailQuery implements IRequest<UserWithPasswordDto> {
  constructor(
    public readonly email: string
  ) { }
}