import { StatusDto } from "@products/application/dtos/status.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";

export class GetAllStatusesQuery implements IRequest<StatusDto[]> {
  constructor() { }
}