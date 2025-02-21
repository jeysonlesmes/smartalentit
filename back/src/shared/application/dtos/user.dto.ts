import { RoleDto } from "@shared/application/dtos/role.dto";

export class UserDto {
  id: string;
  name: string;
  email: string;
  role: RoleDto;
  createdAt: Date;
  updatedAt: Date;
}