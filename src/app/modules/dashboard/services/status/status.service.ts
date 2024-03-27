import { Injectable } from '@angular/core';
import { Status } from '../../models/status.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private statuses: Status[] = [];
  private statuses$ = new Subject<Status[]>();

  constructor() {}

  onStatusesListener(): Observable<Status[]> {
    return this.statuses$.asObservable();
  }

  setStatuses(statuses: Status[]): void {
    this.statuses = statuses;
    this.statuses$.next(this.statuses.slice());
  }

  getStatuses(): Status[] {
    return this.statuses.slice();
  }

  getStatusesName(): string[] {
    return this.statuses.map((status) => status.name).slice();
  }

  createStatus(status: Status): void {
    this.statuses.push(status);
    this.statuses$.next(this.statuses.slice());
  }

  updateStatus(id: number, status: Status): void {
    const index = this.statuses.findIndex((status) => status.id === id);

    if (index !== -1) {
      this.statuses[index] = { ...this.statuses[index], ...status };
      this.statuses$.next(this.statuses.slice());
    }
  }

  deleteStatus(id: number): void {
    const index = this.statuses.findIndex((status) => status.id === id);

    if (index !== -1) {
      this.statuses.splice(index, 1);
      this.statuses$.next(this.statuses.slice());
    }
  }
}
