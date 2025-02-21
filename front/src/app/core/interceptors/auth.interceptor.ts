import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const credentials = authService.credentials();

  if (credentials) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `${credentials.tokenType} ${credentials.accessToken}`
      }
    });

    return next(authReq);
  }

  return next(req);
};