import { AdminRoleGuard } from '@auth/infrastructure/guards/admin-role.guard';
import { Controller, DefaultValuePipe, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PaginatedResultDto } from '@shared/application/dtos/paginated-result.dto';
import { UserDto } from '@shared/application/dtos/user.dto';
import { CommandQueryBus } from '@shared/application/ports/inbound/command-query-bus.port';
import { Logger } from '@shared/application/ports/outbound/logger.port';
import { AuthUser } from '@shared/infrastructure/decorators/auth-user.decorator';
import { Body } from '@shared/infrastructure/decorators/body.decorator';
import { MaxPageIndexPipe } from '@shared/infrastructure/pipes/max-page-index.pipe';
import { MinPageIndexPipe } from '@shared/infrastructure/pipes/min-page-index.pipe';
import { CreateUserCommand } from '@users/application/use-cases/create-user/create-user.command';
import { DeleteUserCommand } from '@users/application/use-cases/delete-user/delete-user.command';
import { GetAllUsersQuery } from '@users/application/use-cases/get-all-users/get-all-users.query';
import { GetUserByIdQuery } from '@users/application/use-cases/get-user/get-user-by-id.query';
import { UpdateUserCommand } from '@users/application/use-cases/update-user/update-user.command';
import { CreateUserDto, CreateUserSchema } from '@users/infrastructure/schemas/create-user.schema';
import { UpdateUserDto, UpdateUserSchema } from '@users/infrastructure/schemas/update-user.schema';

@Controller()
export class UserController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus,
    private readonly logger: Logger
  ) { }

  @Post('/')
  @UseGuards(AdminRoleGuard)
  async create(@Body(CreateUserSchema) request: CreateUserDto): Promise<UserDto> {
    this.logger.info('creating user');
    
    return this.commandQueryBus.send<CreateUserCommand, UserDto>(
      new CreateUserCommand(
        request.name,
        request.email,
        request.password,
        request.role
      )
    );
  }

  @Get('/')
  @UseGuards(AdminRoleGuard)
  async getAll(
    @Query('pageIndex', new DefaultValuePipe(1), MinPageIndexPipe, ParseIntPipe) pageIndex: number,
    @Query('pageSize', new DefaultValuePipe(10), MaxPageIndexPipe, ParseIntPipe) pageSize: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('roles') roles?: string[]
  ): Promise<PaginatedResultDto<UserDto>> {
    this.logger.info('getting users');
    
    return this.commandQueryBus.send<GetAllUsersQuery, Promise<PaginatedResultDto<UserDto>>>(
      new GetAllUsersQuery(
        pageIndex,
        pageSize,
        name,
        email,
        roles
      )
    );
  }

  @Get('/:id')
  async getById(
    @Param('id') id: string,
    @AuthUser() authUser: UserDto
  ): Promise<UserDto> {
    this.logger.info('getting user');

    if (authUser.role.code !== "admin" && authUser.id !== id) {
      throw new ForbiddenException("User can't get other users");
    }
    
    return this.commandQueryBus.send<GetUserByIdQuery, UserDto>(
      new GetUserByIdQuery(
        id
      )
    );
  }

  @Put('/')
  async update(
    @Body(UpdateUserSchema) request: UpdateUserDto,
    @AuthUser() authUser: UserDto
  ): Promise<UserDto> {
    this.logger.info('updating user');
    
    return this.commandQueryBus.send<UpdateUserCommand, UserDto>(
      new UpdateUserCommand(
        request.id,
        request.name,
        request.email,
        request.password,
        request.role,
        authUser
      )
    );
  }

  @Delete('/:id')
  @UseGuards(AdminRoleGuard)
  delete(
    @Param('id') id: string,
    @AuthUser() authUser: UserDto
  ): Promise<void> {
    this.logger.info('deleting user');

    if (authUser.id === id) {
      throw new ForbiddenException('User cannot delete itself');
    }
    
    return this.commandQueryBus.send<DeleteUserCommand, void>(
      new DeleteUserCommand(
        id
      )
    );
  }
}
