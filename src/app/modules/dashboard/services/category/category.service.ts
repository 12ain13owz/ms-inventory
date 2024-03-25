import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category } from '../../models/category.model';

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
