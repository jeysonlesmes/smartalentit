import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { StatusDto } from '@products/application/dtos/status.dto';
import { GetAllStatusesQuery } from '@products/application/use-cases/get-all-statuses/get-all-statuses.query';
import { CommandQueryBus } from '@shared/application/ports/inbound/command-query-bus.port';
import { Logger } from '@shared/application/ports/outbound/logger.port';
import { CacheTTL } from '@shared/infrastructure/decorators/cache-ttl.decorator';
import { CacheInterceptor } from '@shared/infrastructure/interceptors/cache.interceptor';

@Controller('statuses')
export class StatusController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus,
    private readonly logger: Logger
  ) { }

  @Get('/')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  async getAll(): Promise<StatusDto[]> {
    this.logger.info('getting product statuses');
    
    return this.commandQueryBus.send<GetAllStatusesQuery, StatusDto[]>(
      new GetAllStatusesQuery()
    );
  }
}
