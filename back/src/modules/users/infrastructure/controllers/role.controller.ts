import { CacheTTL, Controller, Get, UseInterceptors } from '@nestjs/common';
import { RoleDto } from '@shared/application/dtos/role.dto';
import { CommandQueryBus } from '@shared/application/ports/inbound/command-query-bus.port';
import { Logger } from '@shared/application/ports/outbound/logger.port';
import { CacheInterceptor } from '@shared/infrastructure/interceptors/cache.interceptor';
import { GetAllRolesQuery } from '@users/application/use-cases/get-all-roles/get-all-roles.query';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus,
    private readonly logger: Logger
  ) { }

  @Get('/')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  async getAll(): Promise<RoleDto[]> {
    this.logger.info('getting user roles');
    
    return this.commandQueryBus.send<GetAllRolesQuery, RoleDto[]>(
      new GetAllRolesQuery()
    );
  }
}
