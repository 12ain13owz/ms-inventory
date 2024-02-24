import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user$ = new BehaviorSubject<User>(null);

  constructor() {}

  onUserListener(): Observable<User> {
    return this.user$.asObservable();
  }

  setUser(user: User) {
    this.user$.next(user);
  }
}
