import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Usage, UsageTable } from '../../models/usage.model';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private usages: Usage[] = [];
  private usages$ = new Subject<Usage[]>();

  constructor() {}

  onUsagesListener(): Observable<Usage[]> {
    return this.usages$.asObservable();
  }

  setUsages(usages: Usage[]): void {
    this.usages = usages;
    this.usages$.next(this.usages.slice());
  }

  getUsages(): Usage[] {
    return this.usages.slice();
  }

  getUsagesTable(): UsageTable[] {
    return this.usages.map((usages, i) => ({ no: i + 1, ...usages })).slice();
  }

  getActiveUsageNames(): string[] {
    return this.usages
      .filter((usages) => usages.active)
      .map((usages) => usages.name)
      .slice();
  }

  getActiveUsages(): { id: number; name: string }[] {
    return this.usages
      .filter((usage) => usage.active)
      .map((usage) => ({
        id: usage.id,
        name: usage.name,
      }))
      .slice();
  }

  createUsage(usage: Usage): void {
    this.usages.push(usage);
    this.usages$.next(this.usages.slice());
  }

  updateUsage(id: number, usage: Usage): void {
    const index = this.usages.findIndex((usage) => usage.id === id);

    if (index !== -1) {
      this.usages[index] = {
        ...this.usages[index],
        ...usage,
      };
      this.usages$.next(this.usages.slice());
    }
  }

  deleteUsage(id: number): void {
    const index = this.usages.findIndex((usage) => usage.id === id);

    if (index !== -1) {
      this.usages.splice(index, 1);
      this.usages$.next(this.usages.slice());
    }
  }
}
