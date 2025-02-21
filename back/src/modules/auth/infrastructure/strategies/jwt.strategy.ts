import { JwtPayloadDto } from '@auth/application/dtos/jwt-payload.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from '@shared/application/dtos/user.dto';
import { CommandQueryBus } from '@shared/application/ports/inbound/command-query-bus.port';
import { GetUserByIdQuery } from '@users/application/use-cases/get-user/get-user-by-id.query';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly commandQueryBus: CommandQueryBus,
    readonly _configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_SECRET_KEY')
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserDto> {
    const user = await this.commandQueryBus.send<GetUserByIdQuery, UserDto>(
      new GetUserByIdQuery(payload.id)
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}