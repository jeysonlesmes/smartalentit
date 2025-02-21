import { RoleDto } from "@shared/application/dtos/role.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { GetAllRolesQuery } from "@users/application/use-cases/get-all-roles/get-all-roles.query";
import { RoleRepository } from "@users/domain/repositories/role.repository";

@CommandQuery(GetAllRolesQuery)
export class GetAllRolesHandler implements IRequestHandler<GetAllRolesQuery, RoleDto[]> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly mapper: Mapper
  ) { }

  async handle(_request: GetAllRolesQuery): Promise<RoleDto[]> {
    const roles = await this.roleRepository.getAll();

    return this.mapper.mapArray(roles, RoleDto);
  }
}