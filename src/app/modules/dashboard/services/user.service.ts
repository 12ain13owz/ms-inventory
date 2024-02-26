import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User;
  private user$ = new BehaviorSubject<User>(null);

  constructor() {}

  onUserListener(): Observable<User> {
    return this.user$.asObservable();
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
    this.user$.next(user);
  }
}
