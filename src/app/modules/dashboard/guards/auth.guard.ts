import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../../shared/services/token.service';
import { catchError, map, of } from 'rxjs';
import { AccessToken } from '../../shared/models/token.model';
import { ToastNotificationService } from '../../../core/services/toast-notification.service';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const toastService = inject(ToastNotificationService);

  const accessToken = tokenService.getAccessToken();
  if (!accessToken || accessToken === 'undefined') {
    toastService.error('404', 'ไม่พบ Token! กรุณาเข้าสู่ระบบ');
    router.navigate(['login']);
    return false;
  }

  const expired = jwtHelper.isTokenExpired();
  if (!expired) return true;

  return authService.refreshToken().pipe(
    map((res: AccessToken) => {
      tokenService.setAccessToken(res.accessToken);
      return true;
    }),
    catchError(() => of(false))
  );
};
