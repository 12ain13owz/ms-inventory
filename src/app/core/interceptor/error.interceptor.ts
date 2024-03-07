import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastNotificationService } from '../services/toast-notification.service';
import { TokenService } from '../../modules/shared/services/token.service';
import { AuthApiService } from '../../modules/dashboard/services/auth/auth-api.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastNotificationService);
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const authService = inject(AuthApiService);

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
        authService.logout();
        tokenService.removeToken();
        router.navigate(['login']);
      }

      return throwError(() => error);
    })
  );
};
