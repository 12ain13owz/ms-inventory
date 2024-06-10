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

  onListener(): Observable<Inventory[]> {
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

  assign(item: Inventory[]): void {
    this.inventories = item;
    this.inventories$.next(this.inventories.slice());
  }

  getAll(): Inventory[] {
    return this.inventories.slice();
  }

  getTableData(): InventoryTable[] {
    return this.inventories
      .map((inventory, i) => ({
        no: i + 1,
        id: inventory.id,
        track: inventory.track,
        image: inventory.image,
        code: inventory.code,
        category: inventory.Category.name,
        status: inventory.Status.name,
        fund: inventory.Fund.name,
        location: inventory.Location.name,
        description: inventory.description,
        createdAt: inventory.createdAt,
      }))
      .slice();
  }

  getById(id: number): Inventory {
    return this.inventories.find((item) => item.id === id);
  }

  getByCode(code: string): Inventory {
    return this.inventories.find((item) => item.code === code);
  }

  getByTrack(track: string): Inventory {
    return this.inventories.find((item) => item.track === track);
  }

  getTableDataWithCode(code: string): InventoryTable[] {
    return this.inventories
      .filter((item) => item.code === code)
      .map((item, i) => ({
        no: i + 1,
        id: item.id,
        track: item.track,
        image: item.image,
        code: item.code,
        category: item.Category.name,
        status: item.Status.name,
        fund: item.Fund.name,
        location: item.Location.name,
        description: item.description,
        createdAt: item.createdAt,
      }))
      .slice();
  }

  create(item: Inventory): void {
    this.inventories.push(item);
    this.inventories$.next(this.inventories.slice());
  }

  update(id: number, item: Partial<Inventory>): void {
    const index = this.inventories.findIndex(
      (inventory) => inventory.id === id
    );

    if (index !== -1) {
      this.inventories[index] = { ...this.inventories[index], ...item };
      this.inventories$.next(this.inventories.slice());
    }
  }

  getUseDate(date: Date): string {
    const now = new Date();
    let yearDiff = now.getFullYear() - date.getFullYear();
    let monthDiff = now.getMonth() - date.getMonth();

    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }

    return `${yearDiff} ปี ${monthDiff} เดือน`;
  }
}
