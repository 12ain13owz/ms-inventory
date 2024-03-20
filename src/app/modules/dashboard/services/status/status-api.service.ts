import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { StatusService } from './status.service';
import { Observable, tap } from 'rxjs';
import { Status, StatusResponse } from '../../models/status.model';
import { Message } from '../../../shared/models/response.model';
import { ValidationService } from '../../../shared/services/validation.service';

@Injectable({
  providedIn: 'root',
})
export class StatusApiService {
  private apiUrl: string = environment.apiUrl + 'status';

  constructor(
    private http: HttpClient,
    private statusService: StatusService,
    private validationService: ValidationService
  ) {}

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(this.apiUrl).pipe(
      tap((res) => {
        if (!this.validationService.isEmpty(res))
          this.statusService.setStatuses(res);
      })
    );
  }

  createStatus(payload: Status): Observable<StatusResponse> {
    return this.http
      .post<StatusResponse>(this.apiUrl, payload)
      .pipe(tap((res) => this.statusService.createStatus(res.status)));
  }

  updateStatus(id: number, payload: Status): Observable<StatusResponse> {
    return this.http
      .put<StatusResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap((res) => this.statusService.updateStatus(id, res.status)));
  }

  deleteStatus(id: number): Observable<Message> {
    return this.http
      .delete<Message>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.statusService.deleteStatus(id)));
  }
}
