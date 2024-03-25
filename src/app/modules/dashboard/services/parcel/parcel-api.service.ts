import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { ParcelService } from './parcel.service';
import { ValidationService } from '../../../shared/services/validation.service';
import {
  Parcel,
  ParcelQuantity,
  ParcelResponse,
} from '../../models/parcel.model';

@Injectable({
  providedIn: 'root',
})
export class ParcelApiService {
  private apiUrl: string = environment.apiUrl + 'parcel';

  constructor(private http: HttpClient, private parcelService: ParcelService) {}

  getParcels(): Observable<Parcel[]> {
    return this.http
      .get<Parcel[]>(this.apiUrl)
      .pipe(tap((res) => this.parcelService.setParcels(res)));
  }

  createParcel(payload: Parcel): Observable<ParcelResponse> {
    return this.http
      .post<ParcelResponse>(this.apiUrl, payload)
      .pipe(tap((res) => this.parcelService.createParcel(res.parcel)));
  }

  updateParcel(id: number, payload: Parcel): Observable<ParcelResponse> {
    return this.http
      .patch<ParcelResponse>(`${this.apiUrl}/${payload.id}`, payload)
      .pipe(tap((res) => this.parcelService.updateParcel(id, res.parcel)));
  }

  incrementParcel(id: number, quantity: number): Observable<ParcelQuantity> {
    return this.http
      .patch<ParcelQuantity>(`${this.apiUrl}/increment/${id}`, { quantity })
      .pipe(
        tap((res) => this.parcelService.modifyQuantityParcel(id, res.quantity))
      );
  }

  decrementParcel(id: number, quantity: number): Observable<ParcelQuantity> {
    return this.http
      .patch<ParcelQuantity>(`${this.apiUrl}/decrement/${id}`, { quantity })
      .pipe(
        tap((res) => this.parcelService.modifyQuantityParcel(id, res.quantity))
      );
  }
}
