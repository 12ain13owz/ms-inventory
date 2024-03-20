import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { ToastNotificationService } from '../services/toast-notification.service';
import { AuthApiService } from '../../modules/dashboard/services/auth/auth-api.service';
import { LoadingScreenService } from '../services/loading-screen.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastNotificationService);
  const authService = inject(AuthApiService);
  const loadingScreenService = inject(LoadingScreenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      loadingScreenService.setIsLoading(false);

      const logout = error.error.logout || false;
      const status = error.status === 0 ? 0 : error.status || 500;
      const message =
        status === 0 || status === 500
          ? 'Internal Server Error!'
          : error.error.message || 'Unknown Error!';

      const title = status === 0 ? '500' : status.toString();
      toastr.error(title, message);

      if (logout) authService.logout().subscribe();
      if (status === 0)
        router.navigate(['/error'], { queryParams: { redirected: true } });

      return throwError(() => error);
    })
  );
};
