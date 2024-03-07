import { Injectable } from '@angular/core';
import { Observable, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Message } from './../../../shared/models/response.model';
import { Category, CategoryResponse } from '../../models/category.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private apiUrl: string = environment.apiUrl + 'category';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiUrl)
      .pipe(tap((res) => this.categoryService.setCategoryise(res)));
  }

  createCategory(payload: Partial<Category>): Observable<CategoryResponse> {
    return this.http
      .post<CategoryResponse>(this.apiUrl, payload)
      .pipe(tap((res) => this.categoryService.addCategory(res.category)));
  }

  updateCategory(payload: Category): Observable<Message> {
    return this.http
      .patch<Message>(this.apiUrl, payload)
      .pipe(tap(() => this.categoryService.updateCategory(payload)));
  }

  deleteCategory(id: number): Observable<Message> {
    return this.http
      .delete<Message>(this.apiUrl + '/' + id)
      .pipe(tap(() => this.categoryService.deleteCategory(id)));
  }
}
