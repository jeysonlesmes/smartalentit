import { AuthenticationDto } from "@auth/application/dtos/authentication.dto";
import { JwtPayloadDto } from "@auth/application/dtos/jwt-payload.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "@shared/application/dtos/user.dto";
import { Injectable } from "@shared/infrastructure/adapters/inbound/injectable.adapter";

@Injectable()
export class TokenGeneratorService {
  constructor(private readonly jwtService: JwtService) { }

  generate(user: UserDto): AuthenticationDto {
    const payload: JwtPayloadDto = {
      id: user.id
    };

    return {
      user,
      token: {
        accessToken: this.jwtService.sign(payload),
        tokenType: 'Bearer'
      }
    };
  }
}