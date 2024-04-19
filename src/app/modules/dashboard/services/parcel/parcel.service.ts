import { Injectable } from '@angular/core';
import { Parcel, ParcelTable } from '../../models/parcel.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParcelService {
  private parcels: Parcel[] = [];
  private parcels$ = new Subject<Parcel[]>();

  constructor() {}

  onParcelsListener(): Observable<Parcel[]> {
    return this.parcels$.asObservable();
  }

  setParcel(parcel: Parcel): void {
    this.parcels = [];

    if (parcel) this.parcels.push(parcel);
    this.parcels$.next(this.parcels.slice());
  }

  setParcels(parcels: Parcel[]): void {
    this.parcels = parcels;
    this.parcels$.next(this.parcels.slice());
  }

  getParcels(): Parcel[] {
    return this.parcels.slice();
  }

  getParcelsTable(): ParcelTable[] {
    return this.parcels
      .map((parcel, i) => ({
        no: i + 1,
        id: parcel.id,
        image: parcel.image,
        track: parcel.track,
        receivedDate: new Date(parcel.receivedDate),
        category: parcel.Category.name,
        status: parcel.Status.name,
        detail: parcel.detail,
        quantity: parcel.quantity,
        print: parcel.print,
      }))
      .slice();
  }

  getParcelById(id: number): Parcel {
    return this.parcels.find((parcel) => parcel.id === id);
  }

  getParcelByTrackInput(track: string): ParcelTable[] {
    return this.parcels
      .filter((parcel) => parcel.track === track)
      .map((parcel, i) => ({
        no: i + 1,
        id: parcel.id,
        image: parcel.image,
        track: parcel.track,
        receivedDate: new Date(parcel.receivedDate),
        category: parcel.Category.name,
        status: parcel.Status.name,
        detail: parcel.detail,
        quantity: parcel.quantity,
        print: parcel.print,
      }))
      .slice();
  }

  createParcel(parcel: Parcel): void {
    this.parcels.push(parcel);
    this.parcels$.next(this.parcels.slice());
  }

  updateParcel(id: number, parcel: Parcel): void {
    const index = this.parcels.findIndex((parcel) => parcel.id === id);

    if (index !== -1) {
      this.parcels[index] = { ...this.parcels[index], ...parcel };
      this.parcels$.next(this.parcels.slice());
    }
  }

  modifyQuantityParcel(id: number, quantity: number): void {
    const index = this.parcels.findIndex((parcel) => parcel.id === id);

    if (index !== -1) {
      this.parcels[index].quantity = quantity;
      this.parcels$.next(this.parcels.slice());
    }
  }

  updatePrintParcel(id: number, print: boolean): void {
    const index = this.parcels.findIndex((parcel) => parcel.id === id);

    if (index !== -1) {
      this.parcels[index].print = print;
      this.parcels$.next(this.parcels.slice());
    }
  }
}
