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
  private inChecks: InventoryCheck[] = [];
  private inChecks$ = new Subject<InventoryCheck[]>();

  constructor() {}

  onInChecksListener(): Observable<InventoryCheck[]> {
    return this.inChecks$.asObservable();
  }

  setInChecks(InChecks: InventoryCheck[]): void {
    this.inChecks = InChecks;
    this.inChecks$.next(this.inChecks.slice());
  }

  getInChecks(): InventoryCheck[] {
    return this.inChecks.slice();
  }

  getInCheckByInventoryId(id: number): InventoryCheck {
    return this.inChecks.find((inCheck) => inCheck.Inventory.id === id);
  }

  getInChecksTable(): InventoryCheckTable[] {
    return this.inChecks
      .map((check, i) => ({
        no: i + 1,
        id: check.Inventory.id,
        track: check.Inventory.track,
        image: check.Inventory.image,
        code: check.Inventory.code,
        year: check.year + 543,
        category: check.Inventory.Category.name,
        status: check.Inventory.Status.name,
        usage: check.Inventory.Usage.name,
        description: check.Inventory.description,
      }))
      .slice();
  }

  createInCheck(inCheck: InventoryCheck): void {
    this.inChecks.push(inCheck);
    this.inChecks$.next(this.inChecks.slice());
  }
}
