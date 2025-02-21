import { UserDto } from "@shared/application/dtos/user.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { GetUserByIdQuery } from "@users/application/use-cases/get-user/get-user-by-id.query";
import { UserRepository } from "@users/domain/repositories/user.repository";

@CommandQuery(GetUserByIdQuery)
export class GetUserByIdHandler implements IRequestHandler<GetUserByIdQuery, UserDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mapper: Mapper
  ) { }

  async handle(request: GetUserByIdQuery): Promise<UserDto> {
    const user = await this.userRepository.findOneById(new Uuid(request.id));

    if (!user) {
      return null;
    }

    return this.mapper.map(user, UserDto);
  }
}