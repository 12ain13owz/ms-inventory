import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profile: Profile | null;
  private profile$ = new BehaviorSubject<Profile>(null);

  constructor() {}

  isAdmin(): boolean {
    return this.profile.role === 'admin';
  }

  onListener(): Observable<Profile> {
    return this.profile$.asObservable();
  }

  assign(item: Profile): void {
    this.profile = item;
    this.profile$.next(item);
  }

  get(): Profile {
    return this.profile;
  }

  update(profile: Partial<Profile>): void {
    this.profile = { ...this.profile, ...profile };
    this.profile$.next(this.profile);
  }
}
