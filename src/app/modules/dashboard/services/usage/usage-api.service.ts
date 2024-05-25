import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { UsageService } from './usage.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usage, UsageResponse } from '../../models/usage.model';
import { Message } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UsageApiService {
  private apiUrl: string = environment.apiUrl + 'usage';

  constructor(private http: HttpClient, private usageService: UsageService) {}

  getUsages(): Observable<Usage[]> {
    return this.http
      .get<Usage[]>(this.apiUrl)
      .pipe(tap((res) => this.usageService.setUsages(res)));
  }

  createUsage(payload: Usage): Observable<UsageResponse> {
    return this.http
      .post<UsageResponse>(this.apiUrl, payload)
      .pipe(tap((res) => this.usageService.createUsage(res.usage)));
  }

  updateUsage(id: number, payload: Usage): Observable<UsageResponse> {
    return this.http
      .put<UsageResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap((res) => this.usageService.updateUsage(id, res.usage)));
  }

  deleteUsage(id: number): Observable<Message> {
    return this.http
      .delete<Message>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.usageService.deleteUsage(id)));
  }
}
