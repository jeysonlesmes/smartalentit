import { RoleDto } from "@shared/application/dtos/role.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetAllRolesQuery implements IRequest<RoleDto[]> {
  constructor() { }
}