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

  onInventoriesListener(): Observable<InventoryScan[]> {
    return this.inventories$.asObservable();
  }

  getInventories(): InventoryScan[] {
    return this.inventories.slice();
  }

  getInventoryById(id: number): InventoryScan {
    return this.inventories.find((inventory) => inventory.id === id);
  }

  getInventoryByCode(code: string): InventoryScan {
    return this.inventories.find((inventory) => inventory.code === code);
  }

  createInventory(inventory: Inventory): void {
    const inventoryScan: InventoryScan = {
      id: inventory.id,
      image: inventory.image,
      code: inventory.code,
      description: inventory.description,
    };

    this.inventories.unshift(inventoryScan);
    this.inventories$.next(this.inventories.slice());
  }

  deleteInventory(id: number): void {
    const index = this.inventories.findIndex(
      (inventory) => inventory.id === id
    );

    if (index !== -1) {
      this.inventories.splice(index, 1);
      this.inventories$.next(this.inventories.slice());
    }
  }

  resetInventory(): void {
    this.inventories = [];
    this.inventories$.next(this.inventories.slice());
  }
}
