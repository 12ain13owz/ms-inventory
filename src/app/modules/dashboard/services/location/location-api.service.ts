import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LocationService } from './location.service';
import { Location } from '../../models/location.model';
import { ApiResponse } from '../../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private apiUrl: string = environment.apiUrl + 'location';

  constructor(
    private http: HttpClient,
    private locationService: LocationService
  ) {}

  getAll(): Observable<Location[]> {
    return this.http
      .get<Location[]>(this.apiUrl)
      .pipe(tap((res) => this.locationService.assign(res)));
  }

  create(payload: Location): Observable<ApiResponse<Location>> {
    return this.http
      .post<ApiResponse<Location>>(this.apiUrl, payload)
      .pipe(tap((res) => this.locationService.create(res.item)));
  }

  update(id: number, payload: Location): Observable<ApiResponse<Location>> {
    return this.http
      .put<ApiResponse<Location>>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap((res) => this.locationService.update(id, res.item)));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(tap((res) => this.locationService.delete(id)));
  }
}
