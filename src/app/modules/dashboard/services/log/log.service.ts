import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Log, LogTable } from '../../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private logs: Log[] = [];
  private logs$ = new Subject<Log[]>();

  constructor() {}

  onListener(): Observable<Log[]> {
    return this.logs$.asObservable();
  }

  assign(item: Log[]): void {
    this.logs = item;
    this.logs$.next(this.logs.slice());
  }

  getAll(): Log[] {
    return this.logs.slice();
  }

  getTableData(): LogTable[] {
    return this.logs.map((item, i) => ({ no: i + 1, ...item })).slice();
  }

  getByCode(code: string): LogTable[] {
    return this.logs
      .filter((item) => item.code === code)
      .map((item, i) => ({ no: i + 1, ...item }))
      .slice();
  }

  getById(id: number): Log {
    return this.logs.find((log) => log.id === id);
  }

  create(item: Log): void {
    this.logs.push(item);
    this.logs$.next(this.logs.slice());
  }
}
