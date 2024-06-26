import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { map } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';
import { ToastNotificationService } from '../../../core/services/toast-notification.service';
import { ProfileService } from '../services/profile/profile.service';
import { ProfileApiService } from '../services/profile/profile-api.service';
import { AuthApiService } from '../../auth/services/auth-api.service';
import { LoadingScreenService } from '../../../core/services/loading-screen.service';

export const dashboardGuard: CanActivateChildFn = (childRoute, state) => {
  const loadingScreenService = inject(LoadingScreenService);
  const tokenService = inject(TokenService);
  const toastService = inject(ToastNotificationService);
  const authService = inject(AuthApiService);
  const profileService = inject(ProfileService);
  const profileApiService = inject(ProfileApiService);
  const profile = profileService.get();
  const accessToken = tokenService.getAccessToken();

  if (accessToken && profile) return true;

  loadingScreenService.setIsLoading(true);
  if (!accessToken || accessToken === 'undefined')
    return authService.logout().pipe(map(() => false));

  if (!profile)
    return profileApiService.get().pipe(
      map(() => {
        loadingScreenService.setIsLoading(false);
        return true;
      })
    );

  toastService.error('500', 'Internal Server Error!');
  return authService.logout().pipe(map(() => false));
};
