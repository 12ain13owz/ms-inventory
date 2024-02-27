import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProfileService } from '../services/profile.service';
import { ProfileApiService } from '../services/profile-api.service';
import { Profile } from '../models/profile.model';

export const profileResolver: ResolveFn<Profile> = async (route, state) => {
  const profileService = inject(ProfileService);
  const profile = profileService.getProfile();
  if (profile) return profile;

  const jwtHelper = inject(JwtHelperService);
  const profileApiService = inject(ProfileApiService);
  const decoded = await jwtHelper.decodeToken<{ userId: number }>();
  const observable = await profileApiService
    .getProfile(decoded.userId)
    .toPromise();

  return observable;
};
