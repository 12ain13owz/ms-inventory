import { Injectable } from '@angular/core';
import { Inventory, InventoryTable } from '../../models/inventory.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private inventories: Inventory[] = [];
  private inventories$ = new Subject<Inventory[]>();
  private isLoading: boolean = false;
  private isLoading$ = new Subject<boolean>();

  constructor() {}

  onInventoriesListener(): Observable<Inventory[]> {
    return this.inventories$.asObservable();
  }

  onIsLoadingListener(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.isLoading$.next(isLoading);
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  setInventory(inventory: Inventory): void {
    this.inventories = [];

    if (inventory) this.inventories.push(inventory);
    this.inventories$.next(this.inventories.slice());
  }

  setInventories(inventories: Inventory[]): void {
    this.inventories = inventories;
    this.inventories$.next(this.inventories.slice());
  }

  getInventories(): Inventory[] {
    return this.inventories.slice();
  }

  getInventoriesTable(): InventoryTable[] {
    return this.inventories
      .map((inventory, i) => ({
        id: inventory.id,
        no: i + 1,
        image: inventory.image,
        code: inventory.code,
        category: inventory.Category.name,
        status: inventory.Status.name,
        usage: inventory.Usage.name,
        description: inventory.description,
      }))
      .slice();
  }

  getInventoryById(id: number): Inventory {
    return this.inventories.find((inventory) => inventory.id === id);
  }

  getInventoryByCodeTable(code: string): InventoryTable[] {
    return this.inventories
      .filter((inventory) => inventory.code === code)
      .map((inventory, i) => ({
        id: inventory.id,
        no: i + 1,
        image: inventory.image,
        code: inventory.code,
        category: inventory.Category.name,
        status: inventory.Status.name,
        usage: inventory.Usage.name,
        description: inventory.description,
      }))
      .slice();
  }

  createInventory(inventory: Inventory): void {
    this.inventories.push(inventory);
    this.inventories$.next(this.inventories.slice());
  }

  updateInventory(id: number, inventory: Inventory): void {
    const index = this.inventories.findIndex(
      (inventory) => inventory.id === id
    );

    if (index !== -1) {
      this.inventories[index] = { ...this.inventories[index], ...inventory };
      this.inventories$.next(this.inventories.slice());
    }
  }

  private getUseDate(receivedDate: Date): string {
    const now = new Date();
    const date = now.getTime() - receivedDate.getTime();
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(date / millisecondsPerDay);
    const year = Math.floor(day / 365);
    const remainingDays = day % 365;
    const month = Math.floor(remainingDays / 30);

    return `${year} ปี ${month} เดือน`;
  }
}
