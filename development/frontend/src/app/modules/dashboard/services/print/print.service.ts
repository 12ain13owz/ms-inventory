import { Injectable } from '@angular/core';
import { InventoryPrint } from '../../models/inventory.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private inventories: InventoryPrint[] = [];
  private inventories$ = new Subject<InventoryPrint[]>();

  constructor() {}

  onListener(): Observable<InventoryPrint[]> {
    return this.inventories$.asObservable();
  }

  getAll(): InventoryPrint[] {
    return this.inventories.slice();
  }

  getById(id: number): InventoryPrint {
    return this.inventories.find((item) => item.id === id);
  }

  getByCode(code: string): InventoryPrint {
    return this.inventories.find((item) => item.code === code);
  }

  getByTrack(track: string): InventoryPrint {
    return this.inventories.find((item) => item.track === track);
  }

  create(item: InventoryPrint): void {
    this.inventories.push(item);
    this.inventories$.next(this.inventories.slice());
  }

  updateCount(id: number, count: number): void {
    const index = this.inventories.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.inventories[index].printCount = count;
      this.inventories$.next(this.inventories.slice());
    }
  }

  incrementCount(id: number): void {
    const index = this.inventories.findIndex((item) => item.id === id);

    if (index === -1) return;
    if (this.inventories[index].printCount >= 100) return;

    this.inventories[index].printCount += 1;
    this.inventories$.next(this.inventories.slice());
  }

  decrementCount(id: number): void {
    const index = this.inventories.findIndex((item) => item.id === id);

    if (index === -1) return;
    if (this.inventories[index].printCount <= 1) return;

    this.inventories[index].printCount -= 1;
    this.inventories$.next(this.inventories.slice());
  }

  delete(id: number): void {
    const index = this.inventories.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.inventories.splice(index, 1);
      this.inventories$.next(this.inventories.slice());
    }
  }

  reset(): void {
    this.inventories = [];
    this.inventories$.next(this.inventories.slice());
  }
}
