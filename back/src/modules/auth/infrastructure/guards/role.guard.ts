import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserDto } from '@shared/application/dtos/user.dto';
import { Injectable } from '@shared/infrastructure/adapters/inbound/injectable.adapter';
import { Request } from 'express';

@Injectable()
export class RoleGuard {
  constructor(private readonly requiredRoles: string | string[]) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as UserDto;

    const hasRole = this.getRoles().includes(user.role.code);

    if (!hasRole) {
      throw new ForbiddenException();
    }

    return true;
  }

  private getRoles(): string[] {
    if (Array.isArray(this.requiredRoles)) {
      return this.requiredRoles;
    }

    return [this.requiredRoles];
  }
}