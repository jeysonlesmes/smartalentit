import { StatusDto } from "@products/application/dtos/status.dto";
import { GetAllStatusesQuery } from "@products/application/use-cases/get-all-statuses/get-all-statuses.query";
import { StatusRepository } from "@products/domain/repositories/status.repository";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";

@CommandQuery(GetAllStatusesQuery)
export class GetAllStatusesHandler implements IRequestHandler<GetAllStatusesQuery, StatusDto[]> {
  constructor(
    private readonly statusRepository: StatusRepository,
    private readonly mapper: Mapper
  ) { }

  async handle(_request: GetAllStatusesQuery): Promise<StatusDto[]> {
    const statuses = await this.statusRepository.getAll();

    return this.mapper.mapArray(statuses, StatusDto);
  }
}