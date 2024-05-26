import { Injectable } from '@angular/core';
import { InventoryCheck } from '../../models/inventory-check';
import { Observable, Subject } from 'rxjs';
import { InventoryTable } from '../../models/inventory.model';

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

  getInChecksTable(): InventoryTable[] {
    return this.inChecks
      .map((check, i) => ({
        id: check.Inventory.id,
        no: i + 1,
        image: check.Inventory.image,
        code: check.Inventory.code,
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
