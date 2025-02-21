import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CreateUserHandler } from '@users/application/use-cases/create-user/create-user.handler';
import { DeleteUserHandler } from '@users/application/use-cases/delete-user/delete-user.handler';
import { GetAllRolesHandler } from '@users/application/use-cases/get-all-roles/get-all-roles.handler';
import { GetAllUsersHandler } from '@users/application/use-cases/get-all-users/get-all-users.handler';
import { GetUserByEmailHandler } from '@users/application/use-cases/get-user-by-email/get-user-by-email.handler';
import { GetUserByIdHandler } from '@users/application/use-cases/get-user/get-user-by-id.handler';
import { UpdateUserHandler } from '@users/application/use-cases/update-user/update-user.handler';
import { InfrastructureModule } from '@users/infrastructure/infrastructure.module';

@Module({
  imports: [
    InfrastructureModule,
    RouterModule.register([
      {
        path: 'users',
        module: InfrastructureModule
      }
    ])
  ],
  providers: [
    CreateUserHandler,
    UpdateUserHandler,
    GetUserByIdHandler,
    DeleteUserHandler,
    GetAllUsersHandler,
    GetUserByEmailHandler,
    GetAllRolesHandler
  ]
})
export class UserModule { }
