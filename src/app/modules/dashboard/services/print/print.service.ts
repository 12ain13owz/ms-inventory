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

  onInventoriesListener(): Observable<InventoryPrint[]> {
    return this.inventories$.asObservable();
  }

  getInventories(): InventoryPrint[] {
    return this.inventories.slice();
  }

  getInventoryById(id: number): InventoryPrint {
    return this.inventories.find((inventory) => inventory.id === id);
  }

  getInventoryByCode(code: string): InventoryPrint {
    return this.inventories.find((inventory) => inventory.code === code);
  }

  createInventory(inventory: InventoryPrint): void {
    this.inventories.push(inventory);
    this.inventories$.next(this.inventories.slice());
  }

  updatPrintCountInventory(id: number, count: number): void {
    const index = this.inventories.findIndex(
      (inventory) => inventory.id === id
    );

    if (index !== -1) {
      this.inventories[index].printCount = count;
      this.inventories$.next(this.inventories.slice());
    }
  }

  incrementPrintCount(id: number): void {
    const index = this.inventories.findIndex(
      (inventory) => inventory.id === id
    );

    if (index === -1) return;
    if (this.inventories[index].printCount >= 100) return;

    this.inventories[index].printCount += 1;
    this.inventories$.next(this.inventories.slice());
  }

  decrementPrintCount(id: number): void {
    const index = this.inventories.findIndex(
      (inventory) => inventory.id === id
    );

    if (index === -1) return;
    if (this.inventories[index].printCount <= 1) return;

    this.inventories[index].printCount -= 1;
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
