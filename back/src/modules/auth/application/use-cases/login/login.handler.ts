import { AuthenticationDto } from "@auth/application/dtos/authentication.dto";
import { LoginCommand } from "@auth/application/use-cases/login/login.command";
import { UserNotExistOrInvalidCredentialsException } from "@auth/domain/exceptions/user-not-exist-or-invalid-credentials.exception";
import { TokenGeneratorService } from "@auth/infrastructure/services/token-generator.service";
import { UserWithPasswordDto } from "@shared/application/dtos/user-with-password.dto";
import { CommandQueryBus, IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { PasswordEncryption } from "@shared/application/ports/outbound/password-encryption.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { GetUserByEmailQuery } from "@users/application/use-cases/get-user-by-email/get-user-by-email.query";

@CommandQuery(LoginCommand)
export class LoginHandler implements IRequestHandler<LoginCommand, AuthenticationDto> {
  constructor(
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly passwordEncryption: PasswordEncryption,
    private readonly commandQueryBus: CommandQueryBus
  ) { }

  async handle({ email, password }: LoginCommand): Promise<AuthenticationDto> {
    const user = await this.commandQueryBus.send<GetUserByEmailQuery, UserWithPasswordDto>(
      new GetUserByEmailQuery(
        email
      )
    );

    if (!user || !this.passwordEncryption.compare(password, user.password)) {
      throw new UserNotExistOrInvalidCredentialsException();
    }

    const { password: _, ...data } = user;

    return this.tokenGeneratorService.generate(data);
  }
}