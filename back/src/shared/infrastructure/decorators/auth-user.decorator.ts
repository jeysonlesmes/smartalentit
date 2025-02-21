import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '@shared/application/dtos/user.dto';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as UserDto;
  },
);