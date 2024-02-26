import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../modules/shared/services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  if (!accessToken || accessToken === 'undefined') {
    return next(req);
  }

  const authRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });
  return next(authRequest);
};
