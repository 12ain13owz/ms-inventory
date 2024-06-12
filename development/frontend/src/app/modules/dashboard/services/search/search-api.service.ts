import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchApiService {
  private apiUrl: string = environment.apiUrl + 'inventory/search';

  constructor(private http: HttpClient) {}

  search(payload: string): Observable<string[]> {
    const params = new HttpParams().set('code', payload);
    return this.http.get<string[]>(this.apiUrl, { params });
  }
}
