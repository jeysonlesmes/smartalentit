import { Injectable } from '@shared/infrastructure/adapters/inbound/injectable.adapter';
import { RoleGuard } from './role.guard';

@Injectable()
export class AdminRoleGuard extends RoleGuard {
  constructor() {
    super('admin');
  }
}