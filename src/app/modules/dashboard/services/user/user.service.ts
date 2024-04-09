import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User, UserTable } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];
  private users$ = new Subject<User[]>();

  constructor() {}

  onUsersListener(): Observable<User[]> {
    return this.users$.asObservable();
  }

  setUsers(users: User[]): void {
    this.users = users;
    this.users$.next(this.users.slice());
  }

  getUsers(): User[] {
    return this.users.slice();
  }

  getUsersTable(): UserTable[] {
    return this.users.map((user, i) => ({ no: i + 1, ...user })).slice();
  }

  createUser(user: User): void {
    this.users.push(user);
    this.users$.next(this.users.slice());
  }

  updateUser(id: number, user: User): void {
    const index = this.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
      this.users$.next(this.users.slice());
    }
  }
}
