import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Location, LocationTable } from '../../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private locations: Location[] = [];
  private locations$ = new Subject<Location[]>();

  constructor() {}

  onListener(): Observable<Location[]> {
    return this.locations$.asObservable();
  }

  assign(items: Location[]): void {
    this.locations = items;
    this.locations$.next(this.locations.slice());
  }

  getAll(): Location[] {
    return this.locations.slice();
  }

  getTableData(): LocationTable[] {
    return this.locations.map((item, i) => ({ no: i + 1, ...item })).slice();
  }

  getActiveNames(): string[] {
    return this.locations
      .filter((item) => item.active)
      .map((item) => item.name)
      .slice();
  }

  getActiveDetails(): { id: number; name: string }[] {
    return this.locations
      .filter((item) => item.active)
      .map((item) => ({ id: item.id, name: item.name }))
      .slice();
  }

  create(item: Location): void {
    this.locations.push(item);
    this.locations$.next(this.locations.slice());
  }

  update(id: number, item: Location): void {
    const index = this.locations.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.locations[index] = { ...this.locations[index], ...item };
      this.locations$.next(this.locations.slice());
    }
  }

  delete(id: number): void {
    const index = this.locations.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.locations.splice(index, 1);
      this.locations$.next(this.locations.slice());
    }
  }
}
