import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { ProfileService } from '../services/profile/profile.service';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);
  const profileService = inject(ProfileService);
  const isAdmin = profileService.isAdmin();

  if (!isAdmin) {
    router.navigate(['/scan']);
    return false;
  }
  return true;
};
