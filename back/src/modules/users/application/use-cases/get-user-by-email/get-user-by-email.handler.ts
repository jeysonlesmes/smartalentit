import { UserWithPasswordDto } from "@shared/application/dtos/user-with-password.dto";
import { IRequestHandler } from "@shared/application/ports/inbound/command-query-bus.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { CommandQuery } from "@shared/infrastructure/decorators/command-query.decorator";
import { GetUserByEmailQuery } from "@users/application/use-cases/get-user-by-email/get-user-by-email.query";
import { UserRepository } from "@users/domain/repositories/user.repository";

@CommandQuery(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IRequestHandler<GetUserByEmailQuery, UserWithPasswordDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mapper: Mapper
  ) { }

  async handle({ email }: GetUserByEmailQuery): Promise<UserWithPasswordDto> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      return null;
    }

    return this.mapper.map(user, UserWithPasswordDto);
  }
}