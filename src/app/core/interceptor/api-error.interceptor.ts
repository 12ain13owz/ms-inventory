import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastNotificationService } from '../services/toast-notification.service';
import { catchError, throwError } from 'rxjs';

export const ApiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastNotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error.status || 500;
      const message =
        status === 500
          ? 'Internal Server Error!'
          : error.message || 'Unknown Error!';

      toastr.error(status.toString(), message);
      return throwError(() => error);
    })
  );
};
