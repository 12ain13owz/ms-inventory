import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StatusService } from './status.service';
import { Observable, tap } from 'rxjs';
import { Status } from '../../models/status.model';
import { ApiResponse } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class StatusApiService {
  private apiUrl: string = environment.apiUrl + 'status';

  constructor(private http: HttpClient, private statusService: StatusService) {}

  getAll(): Observable<Status[]> {
    return this.http
      .get<Status[]>(this.apiUrl)
      .pipe(tap((res) => this.statusService.assign(res)));
  }

  create(payload: Status): Observable<ApiResponse<Status>> {
    return this.http
      .post<ApiResponse<Status>>(this.apiUrl, payload)
      .pipe(tap((res) => this.statusService.create(res.item)));
  }

  update(id: number, payload: Status): Observable<ApiResponse<Status>> {
    return this.http
      .put<ApiResponse<Status>>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap((res) => this.statusService.update(id, res.item)));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(tap((res) => this.statusService.delete(id)));
  }
}
