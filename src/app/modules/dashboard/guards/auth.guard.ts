import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { omit } from 'lodash';
import { DecodeUser } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../../shared/services/token.service';
import { catchError, map, of } from 'rxjs';
import { AuthToken } from '../../shared/models/token.model';

export const authGuard: CanActivateChildFn = async (childRoute, state) => {
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const tokenService = inject(TokenService);

  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken || refreshToken === 'undefined') {
    tokenService.removeToken();
    router.navigate(['login']);
    return false;
  }

  const expired = await jwtHelper.isTokenExpired();
  if (!expired) {
    const decoded = await jwtHelper.decodeToken<DecodeUser>();
    const user = omit(decoded, ['iat', 'exp']);
    userService.setUser(user);
    return true;
  }

  const observable = authService.refreshToken(refreshToken).pipe(
    map((res: AuthToken) => {
      tokenService.setAccessToken(res.accessToken);
      tokenService.setRefreshToken(res.refreshToken);
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
