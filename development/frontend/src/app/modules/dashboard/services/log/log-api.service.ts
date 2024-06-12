import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LogService } from './log.service';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { Log } from '../../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class LogApiService {
  private apiUrl: string = environment.apiUrl + 'log';

  constructor(private http: HttpClient, private logService: LogService) {}

  searchByCode(code: string): Observable<Log[]> {
    const params = new HttpParams().set('code', code);

    return this.http.get<Log[]>(`${this.apiUrl}/search/code`, { params }).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.assign(res))
    );
  }

  getAll(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.assign(res))
    );
  }

  getInit(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/init`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.assign(res))
    );
  }

  getByDate(startDate: string, endDate: string): Observable<Log[]> {
    return this.http
      .get<Log[]>(`${this.apiUrl}/date/${startDate}/${endDate}`)
      .pipe(
        switchMap((res) => timer(200).pipe(map(() => res))),
        tap((res) => this.logService.assign(res))
      );
  }

  getByTrack(track: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/track/${track}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.assign(res))
    );
  }

  getByCode(code: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/code/${code}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.logService.assign(res))
    );
  }

  getById(id: number): Observable<Log> {
    return this.http.get<Log>(`${this.apiUrl}/${id}`);
  }
}
