import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [];
  private categories$ = new BehaviorSubject<Category[]>(null);

  constructor() {}

  onCategoriesListener(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  setCategoryise(categories: Category[]): void {
    this.categories = categories;
    this.categories$.next(this.categories.slice());
  }

  getCategories(): Category[] {
    return this.categories.slice();
  }

  addCategory(category: Category): void {
    this.categories.push(category);
    this.categories$.next(this.categories.slice());
  }

  updateCategory(category: Category): void {
    const id = category.id;
    const index = this.categories.findIndex((category) => category.id === id);

    if (index !== -1) {
      this.categories[index] = category;
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
