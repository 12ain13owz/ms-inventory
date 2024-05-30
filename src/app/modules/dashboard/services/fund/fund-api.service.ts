import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { FundService } from './fund.service';
import { Fund } from '../../models/fund.model';
import { ApiResponse } from '../../../shared/models/response.model';
import { SocketFundService } from '../../socket-io/socket-fund.service';

@Injectable({
  providedIn: 'root',
})
export class FundApiService {
  private apiUrl: string = environment.apiUrl + 'fund';

  constructor(
    private http: HttpClient,
    private fundService: FundService,
    private socketFundService: SocketFundService
  ) {}

  getAll(): Observable<Fund[]> {
    return this.http
      .get<Fund[]>(this.apiUrl)
      .pipe(tap((res) => this.fundService.assign(res)));
  }

  create(payload: Fund): Observable<ApiResponse<Fund>> {
    return this.http.post<ApiResponse<Fund>>(this.apiUrl, payload).pipe(
      tap((res) => {
        this.fundService.create(res.item);
        this.socketFundService.create(res.item);
      })
    );
  }

  update(id: number, payload: Fund): Observable<ApiResponse<Fund>> {
    return this.http
      .put<ApiResponse<Fund>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((res) => {
          this.fundService.update(id, res.item);
          this.socketFundService.update(id, res.item);
        })
      );
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      tap((res) => {
        this.fundService.delete(id);
        this.socketFundService.delete(id);
      })
    );
  }
}
