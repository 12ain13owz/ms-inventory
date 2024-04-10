import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  if (!accessToken || accessToken === 'undefined' || accessToken === 'null')
    return true;

  router.navigate(['/']);
  return false;
};
