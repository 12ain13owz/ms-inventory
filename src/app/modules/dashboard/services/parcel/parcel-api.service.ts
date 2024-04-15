import { Injectable } from '@angular/core';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { ParcelService } from './parcel.service';
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

  getAllParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(this.apiUrl).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.parcelService.setParcels(res))
    );
  }

  getInitialParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.apiUrl}/init`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.parcelService.setParcels(res))
    );
  }

  getParcelsByDate(startDate: string, endDate: string): Observable<Parcel[]> {
    return this.http
      .get<Parcel[]>(`${this.apiUrl}/date/${startDate}/${endDate}`)
      .pipe(
        switchMap((res) => timer(200).pipe(map(() => res))),
        tap((res) => this.parcelService.setParcels(res))
      );
  }

  getParcelByTrack(track: string): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.apiUrl}/track/${track}`).pipe(
      switchMap((res) => timer(200).pipe(map(() => res))),
      tap((res) => this.parcelService.setParcel(res))
    );
  }

  getParcelById(id: number): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.apiUrl}/id/${id}`);
  }

  createParcel(payload: FormData): Observable<ParcelResponse> {
    return this.http
      .post<ParcelResponse>(this.apiUrl, payload)
      .pipe(tap((res) => this.parcelService.createParcel(res.parcel)));
  }

  updateParcel(id: number, payload: FormData): Observable<ParcelResponse> {
    return this.http
      .put<ParcelResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap((res) => this.parcelService.updateParcel(id, res.parcel)));
  }

  incrementParcel(id: number, stock: number): Observable<ParcelQuantity> {
    return this.http
      .patch<ParcelQuantity>(`${this.apiUrl}/increment/${id}`, { stock })
      .pipe(
        tap((res) => this.parcelService.modifyQuantityParcel(id, res.quantity))
      );
  }

  decrementParcel(id: number, stock: number): Observable<ParcelQuantity> {
    return this.http
      .patch<ParcelQuantity>(`${this.apiUrl}/decrement/${id}`, { stock })
      .pipe(
        switchMap((res) => timer(300).pipe(map(() => res))),
        tap((res) => this.parcelService.modifyQuantityParcel(id, res.quantity))
      );
  }

  downloadImage(url: string): Observable<Blob> {
    return this.http.get<Blob>(url, { responseType: 'blob' as 'json' });
  }
}
