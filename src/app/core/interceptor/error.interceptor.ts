import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastNotificationService } from '../services/toast-notification.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../modules/shared/services/token.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastNotificationService);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const logout = error.error.logout || false;
      const status = error.status || 500;
      const message =
        status === 500
          ? 'Internal Server Error!'
          : error.error.message || 'Unknown Error!';

      toastr.error(status.toString(), message);
      if (logout) {
        tokenService.removeToken();
        router.navigate(['login']);
      }

      return throwError(() => error);
    })
  );
};
