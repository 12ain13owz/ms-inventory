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

  onCategoriesListener(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  setCategorise(categories: Category[]): void {
    this.categories = categories;
    this.categories$.next(this.categories.slice());
  }

  getCategories(): Category[] {
    return this.categories.slice();
  }

  getCategoriesTable(): CategoryTable[] {
    return this.categories
      .map((category, i) => ({ no: i + 1, ...category }))
      .slice();
  }

  getActiveCategoriesName(): string[] {
    return this.categories
      .filter((category) => category.active)
      .map((category) => category.name)
      .slice();
  }

  getActiveCategories(): { id: number; name: string }[] {
    return this.categories
      .filter((category) => category.active)
      .map((category) => ({ id: category.id, name: category.name }))
      .slice();
  }

  createCategory(category: Category): void {
    this.categories.push(category);
    this.categories$.next(this.categories.slice());
  }

  updateCategory(id: number, category: Category): void {
    const index = this.categories.findIndex((category) => category.id === id);

    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...category };
      this.categories$.next(this.categories.slice());
    }
  }

  deleteCategory(id: number): void {
    const index = this.categories.findIndex((category) => category.id === id);

    if (index !== -1) {
      this.categories.splice(index, 1);
      this.categories$.next(this.categories.slice());
    }
  }
}
