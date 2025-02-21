import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(NzMessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          messageService.error('Unauthorized. Please log in.');
          authService.logout();
          break;

        case 403:
          messageService.error(error?.error?.message ?? 'Forbidden. You do not have permission to access this resource.');
          break;

        case 400:
          let message: string = 'Bad Request. Please check your request.';

          if (error?.error?.errors?.length) {
            message = error.error.errors.at(0).message ?? message;
          }

          messageService.error(message);
          break;

        case 422:
          messageService.error(error?.error?.message ?? 'Unprocessable Entity. Please check your request.');
          break;

        default:
          messageService.error(error?.error?.message ?? 'An error occurred. Please try again later.');
          break;
      }

      return throwError(() => error);
    })
  );
};