import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastNotificationService } from '../services/toast-notification.service';
import { AuthApiService } from '../../modules/dashboard/services/auth/auth-api.service';
import { LoadingScreenService } from '../services/loading-screen.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastNotificationService);
  const authService = inject(AuthApiService);
  const loadingScreenService = inject(LoadingScreenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      loadingScreenService.setIsLoading(false);

      const logout = error.error.logout || false;
      const status = error.status || 500;
      const message =
        status === 500
          ? 'Internal Server Error!'
          : error.error.message || 'Unknown Error!';

      toastr.error(status.toString(), message);
      if (logout) authService.logout();

      return throwError(() => error);
    })
  );
};
