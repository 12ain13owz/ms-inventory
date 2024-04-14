import { Injectable } from '@angular/core';
import { Parcel, ParcelScan } from '../../models/parcel.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  private parcels: ParcelScan[] = [];
  private parcels$ = new Subject<ParcelScan[]>();

  constructor() {}

  onParcelsListener(): Observable<ParcelScan[]> {
    return this.parcels$.asObservable();
  }

  getParcels(): ParcelScan[] {
    return this.parcels.slice();
  }

  getParcelById(id: number): ParcelScan {
    return this.parcels.find((parcel) => parcel.id === id);
  }

  getParcelByTrack(track: string): ParcelScan {
    return this.parcels.find((parcel) => parcel.track === track);
  }

  createParcelScan(parcel: Parcel): void {
    const parcelScan: ParcelScan = {
      id: parcel.id,
      image: parcel.image,
      track: parcel.track,
      quantity: parcel.quantity,
      stock: 1,
    };

    this.parcels.unshift(parcelScan);
    this.parcels$.next(this.parcels.slice());
  }

  updateStockParcel(id: number, stock: number): void {
    const index = this.parcels.findIndex((parcelScan) => parcelScan.id === id);

    if (index !== -1) {
      this.parcels[index].stock = stock;
      this.parcels$.next(this.parcels.slice());
    }
  }

  incrementStockParcel(id: number): void {
    const index = this.parcels.findIndex((parcelScan) => parcelScan.id === id);

    if (index === -1) return;
    if (this.parcels[index].stock >= this.parcels[index].quantity) return;

    this.parcels[index].stock += 1;
    this.parcels$.next(this.parcels.slice());
  }

  decrementStockParcel(id: number): void {
    const index = this.parcels.findIndex((parcelScan) => parcelScan.id === id);

    if (index === -1) return;
    if (this.parcels[index].stock <= 1) return;

    this.parcels[index].stock -= 1;
    this.parcels$.next(this.parcels.slice());
  }

  deleteParcle(id: number): void {
    const index = this.parcels.findIndex((parcelScan) => parcelScan.id === id);

    if (index !== -1) {
      this.parcels.splice(index, 1);
      this.parcels$.next(this.parcels.slice());
    }
  }

  resetParcel(): void {
    this.parcels = [];
    this.parcels$.next(this.parcels.slice());
  }
}
