import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProfileService } from '../services/profile/profile.service';
import { ProfileApiService } from '../services/profile/profile-api.service';
import { Profile } from '../models/profile.model';
import { from, switchMap, firstValueFrom } from 'rxjs';

export const profileResolver: ResolveFn<Profile> = (route, state) => {
  const profileService = inject(ProfileService);
  const profileApiService = inject(ProfileApiService);
  const profile = profileService.getProfile();

  if (!profile) return profileApiService.getProfile();
  return profile;
};
