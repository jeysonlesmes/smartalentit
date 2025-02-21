import { AuthenticationDto } from "@auth/application/dtos/authentication.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class SignUpCommand implements IRequest<AuthenticationDto> {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) { }
}