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

  onLogsListener(): Observable<Log[]> {
    return this.logs$.asObservable();
  }

  setLogs(logs: Log[]): void {
    this.logs = logs;
    this.logs$.next(this.logs.slice());
  }

  getLogs(): Log[] {
    return this.logs.slice();
  }

  getLogsTable(): LogTable[] {
    return this.logs.map((log, i) => ({ no: i + 1, ...log })).slice();
  }

  getLogsByCodeInput(code: string): LogTable[] {
    return this.logs
      .filter((log) => log.code === code)
      .map((log, i) => ({ no: i + 1, ...log }))
      .slice();
  }

  getLogById(id: number): Log {
    return this.logs.find((log) => log.id === id);
  }

  createLog(log: Log): void {
    this.logs.push(log);
    this.logs$.next(this.logs.slice());
  }
}
