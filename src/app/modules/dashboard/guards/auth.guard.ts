import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { map } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';
import { ToastNotificationService } from '../../../core/services/toast-notification.service';
import { ProfileService } from '../services/profile/profile.service';
import { ProfileApiService } from '../services/profile/profile-api.service';
import { AuthApiService } from '../services/auth/auth-api.service';
import { LoadingScreenService } from '../../../core/services/loading-screen.service';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const loadingScreenService = inject(LoadingScreenService);
  const tokenService = inject(TokenService);
  const toastService = inject(ToastNotificationService);
  const authService = inject(AuthApiService);
  const profileService = inject(ProfileService);
  const profileApiService = inject(ProfileApiService);
  const profile = profileService.getProfile();
  const accessToken = tokenService.getAccessToken();

  if (accessToken && profile) return true;
  if (!accessToken || accessToken === 'undefined') {
    toastService.error('404', 'ไม่พบ Token! กรุณาเข้าสู่ระบบ');
    return authService.logout().pipe(map(() => false));
  }

  loadingScreenService.setIsLoading(true);
  if (!profile)
    return profileApiService.getProfile().pipe(
      map(() => {
        loadingScreenService.setIsLoading(false);
        return true;
      })
    );

  toastService.error('500', 'Internal Server Error!');
  return authService.logout().pipe(map(() => false));
};
