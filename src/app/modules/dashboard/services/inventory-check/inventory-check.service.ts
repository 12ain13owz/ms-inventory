import { Injectable, inject } from '@angular/core';
import { InventoryCheck } from '../../models/inventory-check';
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

  createInCheck(inCheck: InventoryCheck): void {
    this.inChecks.push(inCheck);
    this.inChecks$.next(this.inChecks.slice());
  }
}
