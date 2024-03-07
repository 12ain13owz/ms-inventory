import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';
import { ToastNotificationService } from '../../../core/services/toast-notification.service';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const toastService = inject(ToastNotificationService);

  const accessToken = tokenService.getAccessToken();
  if (!accessToken || accessToken === 'undefined') {
    toastService.error('404', 'ไม่พบ Token! กรุณาเข้าสู่ระบบ');
    router.navigate(['login']);
    return false;
  }
  return true;
};
