import { Injectable } from '@angular/core';
import { Status, StatusTable } from '../../models/status.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private statuses: Status[] = [];
  private statuses$ = new Subject<Status[]>();

  constructor() {}

  onListener(): Observable<Status[]> {
    return this.statuses$.asObservable();
  }

  assign(items: Status[]): void {
    this.statuses = items;
    this.statuses$.next(this.statuses.slice());
  }

  getAll(): Status[] {
    return this.statuses.slice();
  }

  getTableData(): StatusTable[] {
    return this.statuses.map((item, i) => ({ no: i + 1, ...item })).slice();
  }

  getActiveNames(): string[] {
    return this.statuses
      .filter((item) => item.active)
      .map((item) => item.name)
      .slice();
  }

  getActiveDetails(): { id: number; name: string }[] {
    return this.statuses
      .filter((item) => item.active)
      .map((item) => ({ id: item.id, name: item.name }))
      .slice();
  }

  create(item: Status): void {
    this.statuses.push(item);
    this.statuses$.next(this.statuses.slice());
  }

  update(id: number, item: Status): void {
    const index = this.statuses.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.statuses[index] = { ...this.statuses[index], ...item };
      this.statuses$.next(this.statuses.slice());
    }
  }

  delete(id: number): void {
    const index = this.statuses.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.statuses.splice(index, 1);
      this.statuses$.next(this.statuses.slice());
    }
  }
}
