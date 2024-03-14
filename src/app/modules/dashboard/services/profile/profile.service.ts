import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profile: Profile | null;
  private profile$ = new BehaviorSubject<Profile>(null);
  private isAdmin: boolean = false;

  constructor() {
    this.profile$.subscribe((profile) => {
      if (profile) this.isAdmin = profile.role === 'admin';
    });
  }

  isProfileAdmin(): boolean {
    return this.isAdmin;
  }

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
