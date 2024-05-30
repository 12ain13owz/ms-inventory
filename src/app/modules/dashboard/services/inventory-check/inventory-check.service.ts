import { Injectable } from '@angular/core';
import {
  InventoryCheck,
  InventoryCheckTable,
} from '../../models/inventory-check';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryCheckService {
  private inventoriesCheck: InventoryCheck[] = [];
  private inventoriesCheck$ = new Subject<InventoryCheck[]>();

  constructor() {}

  onListener(): Observable<InventoryCheck[]> {
    return this.inventoriesCheck$.asObservable();
  }

  assign(item: InventoryCheck[]): void {
    this.inventoriesCheck = item;
    this.inventoriesCheck$.next(this.inventoriesCheck.slice());
  }

  getAll(): InventoryCheck[] {
    return this.inventoriesCheck.slice();
  }

  getByInventoryId(id: number): InventoryCheck {
    return this.inventoriesCheck.find((item) => item.Inventory.id === id);
  }

  getTableData(): InventoryCheckTable[] {
    return this.inventoriesCheck
      .map((item, i) => ({
        no: i + 1,
        id: item.id,
        inventoryId: item.Inventory.id,
        track: item.Inventory.track,
        image: item.Inventory.image,
        code: item.Inventory.code,
        year: item.year + 543,
        category: item.Inventory.Category.name,
        status: item.Inventory.Status.name,
        fund: item.Inventory.Fund.name,
        location: item.Inventory.Location.name,
        description: item.Inventory.description,
      }))
      .slice();
  }

  create(item: InventoryCheck): void {
    this.inventoriesCheck.push(item);
    this.inventoriesCheck$.next(this.inventoriesCheck.slice());
  }

  delete(id: number): void {
    const index = this.inventoriesCheck.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.inventoriesCheck.splice(index, 1);
      this.inventoriesCheck$.next(this.inventoriesCheck.slice());
    }
  }
}
