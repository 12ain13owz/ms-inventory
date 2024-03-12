import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profile: Profile;
  private profile$ = new BehaviorSubject<Profile>(null);

  constructor() {}

  onProfileListener(): Observable<Profile> {
    return this.profile$.asObservable();
  }

  setProfile(profile: Profile): void {
    this.profile = profile;
    this.profile$.next(profile);
  }

  getProfile(): Profile {
    return this.profile;
  }

  updateProfile(profile: Partial<Profile>): void {
    this.profile = { ...this.profile, ...profile };
    this.profile$.next(this.profile);
  }
}
