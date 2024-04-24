import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcel } from '../../models/parcel.model';

@Injectable({
  providedIn: 'root',
})
export class ScanApiService {
  private apiUrl: string = environment.apiUrl + 'parcel';

  constructor(private http: HttpClient) {}

  getParcelByTrack(track: string): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.apiUrl}/track/${track}`);
  }
}
