import { PaginatedResultDto } from "@shared/application/dtos/paginated-result.dto";
import { IRequest } from "@shared/application/ports/inbound/command-query-bus.port";
import { UserDto } from "@shared/application/dtos/user.dto";

export class GetAllUsersQuery implements IRequest<PaginatedResultDto<UserDto>> {
  constructor(
    public readonly pageIndex: number,
    public readonly pageSize: number,
    public readonly name?: string,
    public readonly email?: string,
    public readonly roles?: string[]
  ) { }
}