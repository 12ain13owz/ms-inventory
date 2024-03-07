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

  if (profile) return profile;
  return from(decodeToken()).pipe(
    switchMap((userId: number) => profileApiService.getProfile(userId))
  );

  // Return Promise
  // const jwtHelper = inject(JwtHelperService);
  // return Promise.resolve(jwtHelper.decodeToken<{ userId: number }>()).then(
  //   (data: { userId: number }) =>
  //     firstValueFrom(profileApiService.getProfile(data.userId))
  // );

  // Return Observable
};

async function decodeToken(): Promise<number> {
  const jwtHelper = inject(JwtHelperService);
  const decoded = await jwtHelper.decodeToken<{ userId: number }>();

  return decoded.userId;
}
