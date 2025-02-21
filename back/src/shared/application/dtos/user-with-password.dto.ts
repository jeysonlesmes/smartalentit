import { UserDto } from "@shared/application/dtos/user.dto";

export class UserWithPasswordDto extends UserDto {
  password: string;
}