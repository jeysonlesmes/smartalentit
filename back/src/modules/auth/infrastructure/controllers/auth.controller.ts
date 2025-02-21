import { AuthenticationDto } from '@auth/application/dtos/authentication.dto';
import { LoginCommand } from '@auth/application/use-cases/login/login.command';
import { SignUpCommand } from '@auth/application/use-cases/sign-up/sign-up.command';
import { Public } from '@auth/infrastructure/decorators/public.decorator';
import { LoginDto, LoginSchema } from '@auth/infrastructure/schemas/login.schema';
import { SignUpSchema } from '@auth/infrastructure/schemas/sign-up.schema';
import { Controller, Post } from '@nestjs/common';
import { CommandQueryBus } from '@shared/application/ports/inbound/command-query-bus.port';
import { Logger } from '@shared/application/ports/outbound/logger.port';
import { Body } from '@shared/infrastructure/decorators/body.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus,
    private readonly logger: Logger
  ) { }

  @Post('/login')
  @Public()
  async login(@Body(LoginSchema) request: LoginDto): Promise<AuthenticationDto> {
    this.logger.info('logging user');
    
    return this.commandQueryBus.send<LoginCommand, AuthenticationDto>(
      new LoginCommand(
        request.email,
        request.password
      )
    );
  }

  @Post('/sign-up')
  @Public()
  async signUp(@Body(SignUpSchema) request: SignUpCommand): Promise<AuthenticationDto> {
    this.logger.info('signing up user');
    
    return this.commandQueryBus.send<SignUpCommand, AuthenticationDto>(
      new SignUpCommand(
        request.name,
        request.email,
        request.password
      )
    );
  }
}
