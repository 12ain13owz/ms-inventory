import { Injectable } from '@angular/core';
import { Inventory, InventoryScan } from '../../models/inventory.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  private inventories: InventoryScan[] = [];
  private inventories$ = new Subject<InventoryScan[]>();

  constructor() {}

  onListener(): Observable<InventoryScan[]> {
    return this.inventories$.asObservable();
  }

  getAll(): InventoryScan[] {
    return this.inventories.slice();
  }

  getById(id: number): InventoryScan {
    return this.inventories.find((item) => item.id === id);
  }

  getByCode(code: string): InventoryScan {
    return this.inventories.find((item) => item.code === code);
  }

  getByTrack(track: string): InventoryScan {
    return this.inventories.find((item) => item.track === track);
  }

  create(item: Inventory): void {
    const inventoryScan: InventoryScan = {
      id: item.id,
      image: item.image,
      code: item.code,
      track: item.track,
      description: item.description,
    };

    this.inventories.unshift(inventoryScan);
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
