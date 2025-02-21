import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(NzMessageService);

  const requiredRole = route.data?.['role'];

  const userRole = authService.user()?.role.code;

  if (userRole === requiredRole) {
    return true;
  }
  
  messageService.error('You do not have permission to access this page');
  router.navigate(['/']);
  return false;
};
