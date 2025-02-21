import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";
import { UserDto } from "@shared/application/dtos/user.dto";

export class GetUserByIdQuery implements IRequest<UserDto> {
  constructor(
    public readonly id: string
  ) { }
}