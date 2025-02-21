import { AuthenticationDto } from "@auth/application/dtos/authentication.dto";
import { SignUpCommand } from "@auth/application/use-cases/sign-up/sign-up.command";
import { TokenGeneratorService } from "@auth/infrastructure/services/token-generator.service";
import { UserDto } from "@shared/application/dtos/user.dto";
import { CommandQueryBus, IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { CreateUserCommand } from "@users/application/use-cases/create-user/create-user.command";

@CommandQuery(SignUpCommand)
export class SignUpHandler implements IRequestHandler<SignUpCommand, AuthenticationDto> {
  constructor(
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly commandQueryBus: CommandQueryBus
  ) { }

  async handle({ name, email, password }: SignUpCommand): Promise<AuthenticationDto> {
    const user = await this.commandQueryBus.send<CreateUserCommand, UserDto>(
      new CreateUserCommand(
        name,
        email,
        password,
        'user'
      )
    );

    return this.tokenGeneratorService.generate(user);
  }
}