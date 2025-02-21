import { PaginatedResultDto } from "@shared/application/dtos/paginated-result.dto";
import { UserDto } from "@shared/application/dtos/user.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { GetAllUsersQuery } from "@users/application/use-cases/get-all-users/get-all-users.query";
import { UserRepository } from "@users/domain/repositories/user.repository";

@CommandQuery(GetAllUsersQuery)
export class GetAllUsersHandler implements IRequestHandler<GetAllUsersQuery, PaginatedResultDto<UserDto>> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mapper: Mapper
  ) { }

  async handle({ pageIndex, pageSize, name, email, roles }: GetAllUsersQuery): Promise<PaginatedResultDto<UserDto>> {
    const { items: users, total } = await this.userRepository.findPaginated({ pageIndex, pageSize, name, email, roles });

    return PaginatedResultDto.create(
      this.mapper.mapArray(users, UserDto),
      total,
      pageIndex,
      pageSize
    );
  }
}