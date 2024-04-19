import { Injectable } from '@angular/core';
import { ParcelPrint } from '../../models/parcel.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private parcels: ParcelPrint[] = [];
  private parcels$ = new Subject<ParcelPrint[]>();

  constructor() {}

  onParcelsListener(): Observable<ParcelPrint[]> {
    return this.parcels$.asObservable();
  }

  getParcels(): ParcelPrint[] {
    return this.parcels.slice();
  }

  getParcelById(id: number): ParcelPrint {
    return this.parcels.find((parcel) => parcel.id === id);
  }

  createParcel(parcel: ParcelPrint): void {
    this.parcels.push(parcel);
    this.parcels$.next(this.parcels.slice());
  }

  updatPrintCountParcel(id: number, stock: number): void {
    const index = this.parcels.findIndex((parcel) => parcel.id === id);

    if (index !== -1) {
      this.parcels[index].printCount = stock;
      this.parcels$.next(this.parcels.slice());
    }
  }

  incrementPrintCount(id: number): void {
    const index = this.parcels.findIndex((parcel) => parcel.id === id);

    if (index === -1) return;
    if (this.parcels[index].printCount >= this.parcels[index].quantity) return;

    this.parcels[index].printCount += 1;
    this.parcels$.next(this.parcels.slice());
  }

  decrementPrintCount(id: number): void {
    const index = this.parcels.findIndex((parcel) => parcel.id === id);

    if (index === -1) return;
    if (this.parcels[index].printCount <= 1) return;

    this.parcels[index].printCount -= 1;
    this.parcels$.next(this.parcels.slice());
  }

  deleteParcle(id: number): void {
    const index = this.parcels.findIndex((parcel) => parcel.id === id);

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
