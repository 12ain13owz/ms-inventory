import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { LogService } from './log.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { Log } from '../../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class LogApiService {
  private apiUrl: string = environment.apiUrl + 'log';

  constructor(private http: HttpClient, private logService: LogService) {}

  getAllLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.setLogs(res))
    );
  }

  getInitialLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/init`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.setLogs(res))
    );
  }

  getLogsByDate(startDate: string, endDate: string): Observable<Log[]> {
    return this.http
      .get<Log[]>(`${this.apiUrl}/date/${startDate}/${endDate}`)
      .pipe(
        switchMap((res) => timer(200).pipe(map(() => res))),
        tap((res) => this.logService.setLogs(res))
      );
  }

  getLogsByTrack(track: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/track/${track}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.setLogs(res))
    );
  }

  getLogById(id: number): Observable<Log> {
    return this.http.get<Log>(`${this.apiUrl}/${id}`);
  }
}
