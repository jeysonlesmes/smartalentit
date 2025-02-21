import { LoginHandler } from '@auth/application/use-cases/login/login.handler';
import { SignUpHandler } from '@auth/application/use-cases/sign-up/sign-up.handler';
import { InfrastructureModule } from '@auth/infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    InfrastructureModule,
    RouterModule.register([
      {
        path: 'auth',
        module: InfrastructureModule
      }
    ])
  ],
  providers: [
    LoginHandler,
    SignUpHandler
  ]
})
export class AuthModule { }
