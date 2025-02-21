import { UserDto } from "@shared/application/dtos/user.dto";

export class AuthenticationDto {
  user: UserDto;
  token: {
    tokenType: string;
    accessToken: string;
  };
}