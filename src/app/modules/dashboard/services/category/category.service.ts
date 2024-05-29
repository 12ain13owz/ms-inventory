import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category, CategoryTable } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [];
  private categories$ = new Subject<Category[]>();

  constructor() {}

  onListener(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  assign(items: Category[]): void {
    this.categories = items;
    this.categories$.next(this.categories.slice());
  }

  getAll(): Category[] {
    return this.categories.slice();
  }

  getTableData(): CategoryTable[] {
    return this.categories.map((item, i) => ({ no: i + 1, ...item })).slice();
  }

  getActiveNames(): string[] {
    return this.categories
      .filter((item) => item.active)
      .map((item) => item.name)
      .slice();
  }

  getActiveDetails(): { id: number; name: string }[] {
    return this.categories
      .filter((item) => item.active)
      .map((item) => ({ id: item.id, name: item.name }))
      .slice();
  }

  create(item: Category): void {
    this.categories.push(item);
    this.categories$.next(this.categories.slice());
  }

  update(id: number, item: Category): void {
    const index = this.categories.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...item };
      this.categories$.next(this.categories.slice());
    }
  }

  delete(id: number): void {
    const index = this.categories.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.categories.splice(index, 1);
      this.categories$.next(this.categories.slice());
    }
  }
}
