import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { omit } from 'lodash';
import { DecodeUser } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../../shared/services/token.service';
import { catchError, map, of } from 'rxjs';
import { AccessToken } from '../../shared/models/token.model';
import { ToastNotificationService } from '../../../core/services/toast-notification.service';

export const authGuard: CanActivateChildFn = async (childRoute, state) => {
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const tokenService = inject(TokenService);
  const toastService = inject(ToastNotificationService);

  const accessToken = tokenService.getAccessToken();
  if (!accessToken || accessToken === 'undefined') {
    toastService.error('404', 'ไม่พบ Token! กรุณาเข้าสู่ระบบ');
    router.navigate(['login']);
    return false;
  }

  const decoded = await jwtHelper.decodeToken<DecodeUser>();
  const user = omit(decoded, ['iat', 'exp']);
  const expired = await jwtHelper.isTokenExpired();
  if (!expired) {
    userService.setUser(user);
    return true;
  }

  const observable = authService.refreshToken().pipe(
    map(async (res: AccessToken) => {
      tokenService.setAccessToken(res.accessToken);
      userService.setUser(user);
      return true;
    }),
    catchError(() => {
      tokenService.removeToken();
      router.navigate(['login']);
      return of(false);
    })
  );

  return await observable.toPromise();
};
