import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Fund, FundTable } from '../../models/fund.model';

@Injectable({
  providedIn: 'root',
})
export class FundService {
  private funds: Fund[] = [];
  private funds$ = new Subject<Fund[]>();

  constructor() {}

  onListener(): Observable<Fund[]> {
    return this.funds$.asObservable();
  }

  assign(items: Fund[]): void {
    this.funds = items;
    this.funds$.next(this.funds.slice());
  }

  getAll(): Fund[] {
    return this.funds.slice();
  }

  getTableData(): FundTable[] {
    return this.funds.map((item, i) => ({ no: i + 1, ...item })).slice();
  }

  getActiveNames(): string[] {
    return this.funds
      .filter((item) => item.active)
      .map((item) => item.name)
      .slice();
  }

  getActiveDetails(): { id: number; name: string }[] {
    return this.funds
      .filter((item) => item.active)
      .map((item) => ({ id: item.id, name: item.name }))
      .slice();
  }

  create(item: Fund): void {
    this.funds.push(item);
    this.funds$.next(this.funds.slice());
  }

  update(id: number, item: Fund): void {
    const index = this.funds.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.funds[index] = { ...this.funds[index], ...item };
      this.funds$.next(this.funds.slice());
    }
  }

  delete(id: number): void {
    const index = this.funds.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.funds.splice(index, 1);
      this.funds$.next(this.funds.slice());
    }
  }
}
