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

  onListener(): Observable<User[]> {
    return this.users$.asObservable();
  }

  assign(items: User[]): void {
    this.users = items;
    this.users$.next(this.users.slice());
  }

  getAll(): User[] {
    return this.users.slice();
  }

  getTableData(): UserTable[] {
    return this.users.map((item, i) => ({ no: i + 1, ...item })).slice();
  }

  create(item: User): void {
    this.users.push(item);
    this.users$.next(this.users.slice());
  }

  update(id: number, item: User): void {
    const index = this.users.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...item };
      this.users$.next(this.users.slice());
    }
  }
}
